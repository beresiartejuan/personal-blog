CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_slug` text NOT NULL,
	`anonymous_id` text NOT NULL,
	`backup_fingerprint` text,
	`author_name` text,
	`content` text NOT NULL,
	`is_flagged` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `comments_post_slug_idx` ON `comments` (`post_slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `comments_anonymous_id_idx` ON `comments` (`anonymous_id`);--> statement-breakpoint
CREATE TABLE `post_likes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_slug` text NOT NULL,
	`session_id` text NOT NULL,
	`liked_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_post_like` ON `post_likes` (`post_slug`,`session_id`);--> statement-breakpoint
CREATE TABLE `post_views` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_slug` text NOT NULL,
	`viewed_at` integer NOT NULL,
	`session_id` text NOT NULL,
	`view_date` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_post_view` ON `post_views` (`post_slug`,`session_id`,`view_date`);--> statement-breakpoint
CREATE UNIQUE INDEX `post_views_slug_idx` ON `post_views` (`post_slug`);--> statement-breakpoint
CREATE TABLE `subscribers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text,
	`subscribed_at` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscribers_email_unique` ON `subscribers` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `subscribers_email_idx` ON `subscribers` (`email`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);