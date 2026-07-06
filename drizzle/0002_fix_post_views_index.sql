-- Migration: Fix post_views_slug_idx from UNIQUE to regular index
-- Issue: The index was incorrectly defined as UNIQUE, preventing multiple users from viewing the same post
-- Solution: Drop the unique index and recreate it as a regular index

-- Drop the existing unique index
DROP INDEX IF EXISTS "post_views_slug_idx";

-- Create a new regular (non-unique) index
CREATE INDEX "post_views_slug_idx" ON "post_views" ("post_slug");