import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

// Tabla de vistas de posts - sistema de visitas únicas (1 por persona/post/día)
export const postViewsTable = sqliteTable("post_views", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postSlug: text("post_slug").notNull(),
  viewedAt: integer("viewed_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  sessionId: text("session_id").notNull(), // Identificador anónimo del visitante
  viewDate: text("view_date").notNull(), // Fecha en formato YYYY-MM-DD para deduplicación
}, (table) => ([
  // Índice único para evitar múltiples visitas del mismo usuario al mismo post en el mismo día
  uniqueIndex("unique_post_view").on(table.postSlug, table.sessionId, table.viewDate),
  // Índice para queries rápidas por post
  uniqueIndex("post_views_slug_idx").on(table.postSlug),
]));

// Tabla de comentarios anónimos
export const commentsTable = sqliteTable("comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postSlug: text("post_slug").notNull(),
  anonymousId: text("anonymous_id").notNull(), // Identificador anónimo de la cookie
  backupFingerprint: text("backup_fingerprint"), // Hash de IP + navegador para moderación
  authorName: text("author_name"), // Nombre opcional que elige mostrar
  content: text("content").notNull(),
  isFlagged: integer("is_flagged", { mode: "boolean" }).notNull().default(false), // Marcado por contenido inapropiado
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
}, (table) => ([
  // Índice para obtener comentarios de un post específico
  uniqueIndex("comments_post_slug_idx").on(table.postSlug),
  // Índice para rate limiting por anonymousId
  uniqueIndex("comments_anonymous_id_idx").on(table.anonymousId),
]));

// Types inferidos
export type PostView = typeof postViewsTable.$inferSelect;
export type NewPostView = typeof postViewsTable.$inferInsert;

export type Comment = typeof commentsTable.$inferSelect;
export type NewComment = typeof commentsTable.$inferInsert;
