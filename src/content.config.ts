import { SITE } from "@config";
import { defineCollection } from "astro:content";
import { glob } from 'astro/loaders';
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema:
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      description: z.string(),
      canonicalURL: z.string().optional(),
    }),
});

export const collections = { blog };
