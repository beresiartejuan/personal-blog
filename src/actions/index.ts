import { defineAction } from "astro:actions";
import { z } from "zod";
import { db } from "@/db";
import { commentsTable, postViewsTable, blacklistTable } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers } from "obscenity";
import { format } from "date-fns";

// Configuración del matcher de obscenidades
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});
const censor = new TextCensor();

/**
 * Verifica si un usuario está en la blacklist
 * @returns {Promise<{isBlacklisted: boolean, reason?: string}>}
 */
async function checkBlacklist(anonymousId: string, fingerprint: string): Promise<{ isBlacklisted: boolean; reason?: string }> {
  const entry = await db
    .select()
    .from(blacklistTable)
    .where(
      and(
        eq(blacklistTable.anonymousId, anonymousId),
        eq(blacklistTable.fingerprint, fingerprint)
      )
    )
    .limit(1);

  if (entry.length > 0) {
    return {
      isBlacklisted: true,
      reason: entry[0].reason,
    };
  }

  return { isBlacklisted: false };
}

/**
 * Verifica rate limiting y banea si excede el límite
 * Límite: 20 comentarios en 30 minutos
 * @returns {Promise<{withinLimit: boolean; message?: string}>}
 */
async function checkRateLimit(anonymousId: string, fingerprint: string): Promise<{ withinLimit: boolean; message?: string }> {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  // Verificar si ya está baneado primero
  const blacklistCheck = await checkBlacklist(anonymousId, fingerprint);
  if (blacklistCheck.isBlacklisted) {
    return {
      withinLimit: false,
      message: "Tu cuenta ha sido bloqueada por actividad sospechosa. Ya no puedes comentar.",
    };
  }

  // Contar comentarios recientes por anonymousId O fingerprint
  const recentComments = await db
    .select()
    .from(commentsTable)
    .where(
      and(
        sql`${commentsTable.createdAt} >= ${thirtyMinutesAgo}`,
        sql`(${commentsTable.anonymousId} = ${anonymousId} OR ${commentsTable.backupFingerprint} = ${fingerprint})`
      )
    );

  const commentCount = recentComments.length;

  // Si excede 20 comentarios en 30 minutos, banear permanentemente
  if (commentCount >= 20) {
    // Verificar que no esté ya baneado
    const existingBan = await db
      .select()
      .from(blacklistTable)
      .where(eq(blacklistTable.anonymousId, anonymousId))
      .limit(1);

    if (existingBan.length === 0) {
      // Agregar a blacklist
      await db.insert(blacklistTable).values({
        anonymousId,
        fingerprint,
        reason: "Exceso de comentarios: 20+ comentarios en 30 minutos",
        commentCount,
      });
    }

    return {
      withinLimit: false,
      message: "Tu cuenta ha sido bloqueada por actividad sospechosa. Ya no puedes comentar.",
    };
  }

  // Rate limiting normal: 5 comentarios por hora (mantener compatibilidad)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const hourlyComments = await db
    .select()
    .from(commentsTable)
    .where(
      and(
        sql`${commentsTable.createdAt} >= ${oneHourAgo}`,
        sql`(${commentsTable.anonymousId} = ${anonymousId} OR ${commentsTable.backupFingerprint} = ${fingerprint})`
      )
    );

  if (hourlyComments.length >= 5) {
    return {
      withinLimit: false,
      message: "Has alcanzado el límite de comentarios. Por favor, espera una hora.",
    };
  }

  return { withinLimit: true };
}

export const server = {
  // Acción para registrar una visita única
  recordVisit: defineAction({
    input: z.object({
      postSlug: z.string(),
      anonymousId: z.string(),
    }),
    handler: async ({ postSlug, anonymousId }) => {
      const today = format(new Date(), "yyyy-MM-dd");

      try {
        // Intentar insertar la visita (fallará silenciosamente si ya existe por el unique index)
        await db.insert(postViewsTable).values({
          postSlug,
          sessionId: anonymousId,
          viewDate: today,
        });
      } catch (error) {
        // La visita ya existe para hoy, ignorar el error
      }

      // Obtener conteo total de visitas únicas para este post
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(postViewsTable)
        .where(eq(postViewsTable.postSlug, postSlug));

      return {
        success: true,
        viewCount: result[0]?.count || 0,
      };
    },
  }),

  // Acción para crear un comentario
  submitComment: defineAction({
    input: z.object({
      postSlug: z.string(),
      anonymousId: z.string().min(10),
      authorName: z.string().max(50).optional(),
      content: z.string().min(1).max(2000),
      honeypot: z.string().optional(), // Campo trampa
      fingerprint: z.string(), // Hash de IP + navegador
    }),
    handler: async ({ postSlug, anonymousId, authorName, content, honeypot, fingerprint }) => {
      // Verificar campo trampa (honeypot) - si está lleno, es un bot
      if (honeypot && honeypot.length > 0) {
        // Simular éxito para no revelar que es un honeypot
        return {
          success: true,
          message: "Comentario enviado correctamente",
          comment: null,
        };
      }

      // Verificar blacklist primero
      const blacklistCheck = await checkBlacklist(anonymousId, fingerprint);
      if (blacklistCheck.isBlacklisted) {
        return {
          success: false,
          message: "Tu cuenta ha sido bloqueada por actividad sospechosa. Ya no puedes comentar.",
          comment: null,
        };
      }

      // Verificar rate limiting (incluye baneo automático si excede 20 en 30 min)
      const rateLimit = await checkRateLimit(anonymousId, fingerprint);
      if (!rateLimit.withinLimit) {
        return {
          success: false,
          message: rateLimit.message,
          comment: null,
        };
      }

      // Verificar contenido inapropiado
      const matches = matcher.getAllMatches(content);
      const isFlagged = matches.length > 0;

      // Censurar el contenido si tiene palabras inapropiadas
      let processedContent = content;
      if (isFlagged) {
        const censored = censor.applyTo(content, matches);
        processedContent = censored;
      }

      // Insertar el comentario
      const result = await db.insert(commentsTable).values({
        postSlug,
        anonymousId,
        backupFingerprint: fingerprint,
        authorName: authorName?.trim() || null,
        content: processedContent,
        isFlagged,
      }).returning();

      return {
        success: true,
        message: isFlagged
          ? "Tu comentario fue publicado pero contenía lenguaje inapropiado y fue censurado."
          : "Comentario publicado correctamente",
        comment: result[0],
      };
    },
  }),

  // Acción para obtener comentarios de un post
  getComments: defineAction({
    input: z.object({
      postSlug: z.string(),
    }),
    handler: async ({ postSlug }) => {
      const comments = await db
        .select()
        .from(commentsTable)
        .where(eq(commentsTable.postSlug, postSlug))
        .orderBy(sql`${commentsTable.createdAt} DESC`);

      return {
        success: true,
        comments,
      };
    },
  }),

  // Acción para verificar si un usuario está baneado (opcional, para UI)
  checkBanStatus: defineAction({
    input: z.object({
      anonymousId: z.string(),
      fingerprint: z.string(),
    }),
    handler: async ({ anonymousId, fingerprint }) => {
      const result = await checkBlacklist(anonymousId, fingerprint);
      return {
        isBanned: result.isBlacklisted,
        reason: result.reason,
      };
    },
  }),
};
