## Development

When starting the dev server, use background mode:

```
pnpm dev --background
```

Manage the background server with `pnpm astro dev stop`, `pnpm astro dev status`, and `pnpm astro dev logs`.

## Build & Deploy

- `pnpm build` - Build production site to `./dist/`
- Deploys to Vercel via `@astrojs/vercel` adapter
- Site URL: `https://blog.beresiarte.xyz`

## Project Structure

- `src/content/blog/` - Markdown blog posts with frontmatter schema
- `src/content.config.ts` - Content collection schema definition
- `src/config.ts` - Site-wide config (URL, author)
- `src/layouts/` - Astro layout components
- `src/styles/global.css` - Tailwind CSS entry point

## Path Aliases

TypeScript path aliases configured in `tsconfig.json`:
- `@config` → `./src/config.ts`
- `@/*` → `./src/*`

## Content Collections

Blog posts require frontmatter matching schema in `src/content.config.ts`:
- `author`, `pubDatetime`, `title`, `description` (required)
- `modDatetime`, `featured`, `draft`, `tags`, `canonicalURL` (optional)

## Tech Stack

- Astro 7.x with MDX support
- Tailwind CSS 4.x via Vite plugin
- Vercel adapter for SSR/deployment
- date-fns for date formatting
- motion (Framer Motion) for animations
