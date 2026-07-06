import { defineAction } from "astro:actions";
import { z } from "zod";
import { db } from "@/db";
import { commentsTable, postViewsTable } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers } from "obscenity";
import { format } from "date-fns";
import crypto from "crypto";

// Configuración del matcher de obscenidades
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});
const censor = new TextCensor();

// Función para verificar rate limiting (máximo 5 comentarios por hora)
async function checkRateLimit(anonymousId: string, fingerprint: string): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  const recentComments = await db
    .select()
    .from(commentsTable)
    .where(
      and(
        sql`${commentsTable.createdAt} >= ${oneHourAgo}`,
        sql`(${commentsTable.anonymousId} = ${anonymousId} OR ${commentsTable.backupFingerprint} = ${fingerprint})`
      )
    );
  
  return recentComments.length < 5;
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
        viewCount: result[0]?.count || 0 
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
    handler: async ({ postSlug, anonymousId, authorName, content, honeypot, fingerprint }, context) => {
      // Verificar campo trampa (honeypot) - si está lleno, es un bot
      if (honeypot && honeypot.length > 0) {
        // Simular éxito para no revelar que es un honeypot
        return { 
          success: true, 
          message: "Comentario enviado correctamente",
          comment: null 
        };
      }

      // Verificar rate limiting
      const withinLimit = await checkRateLimit(anonymousId, fingerprint);
      if (!withinLimit) {
        return { 
          success: false, 
          message: "Has alcanzado el límite de comentarios. Por favor, espera una hora.",
          comment: null 
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
        comment: result[0]
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
        comments 
      };
    },
  }),
};