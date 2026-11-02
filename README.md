# Blog personal

Blog técnico en español sobre JavaScript, TypeScript, React y Astro. Publicado en [blog.beresiarte.xyz](https://blog.beresiarte.xyz).

## Características

- Posts en MDX con etiquetas, búsqueda y página "sobre mí"
- Comentarios y contador de vistas propios, guardados en Turso con Drizzle
- Protección contra spam: rate limiting y filtro de lenguaje ofensivo (`obscenity`)
- SEO: sitemap y metadatos con `astro-seo`
- Animaciones con `motion`

## Stack

- [Astro](https://astro.build) 7 con MDX y componentes Preact
- Tailwind CSS 4
- Turso (libSQL) y Drizzle ORM, con migraciones en `drizzle/`
- Zod para validar datos
- Despliegue en Vercel

## Estructura

```
src/
  content/blog/   Posts en Markdown/MDX
  pages/          Inicio, blog, tags, búsqueda y sobre mí
  actions/        Acciones del servidor (comentarios, vistas)
  db/             Esquema de Drizzle
  components/     Componentes de interfaz
drizzle/          Migraciones
```

## Puesta en marcha

Requiere Node.js 22.12 o superior y pnpm.

```bash
pnpm install
cp .env.example .env     # completá TURSO_DATABASE_URL y TURSO_AUTH_TOKEN
pnpm db:migrate
pnpm dev
```

| Variable | Descripción |
|---|---|
| `TURSO_DATABASE_URL` | URL de la base de datos Turso |
| `TURSO_AUTH_TOKEN` | Token de acceso |
| `SITE_URL` | URL pública del sitio (opcional) |

## Scripts

```bash
pnpm dev          # servidor de desarrollo
pnpm build        # build de producción
pnpm preview      # previsualizar el build
pnpm db:generate  # generar migraciones
pnpm db:migrate   # aplicar migraciones
pnpm db:studio    # Drizzle Studio
```

## Autor

Juan Beresiarte — [@beresiartejuan](https://github.com/beresiartejuan)
