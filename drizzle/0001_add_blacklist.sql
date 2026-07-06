-- Migration: Add blacklist table for rate limiting
--> statement-breakpoint

-- Tabla de blacklist para usuarios baneados permanentemente
CREATE TABLE `blacklist` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`anonymous_id` text NOT NULL,
	`fingerprint` text NOT NULL,
	`banned_at` integer NOT NULL,
	`reason` text NOT NULL,
	`comment_count` integer NOT NULL
);
--> statement-breakpoint

-- Índices para la tabla blacklist
CREATE UNIQUE INDEX `blacklist_anonymous_id_idx` ON `blacklist` (`anonymous_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `blacklist_fingerprint_idx` ON `blacklist` (`fingerprint`);--> statement-breakpoint

-- Agregar índice para fingerprint en comments (para búsquedas de rate limiting)
CREATE UNIQUE INDEX `comments_fingerprint_idx` ON `comments` (`backup_fingerprint`);
