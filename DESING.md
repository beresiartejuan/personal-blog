# DESIGN.md — Rediseño del blog personal

## 1. Concepto general

Blog técnico centrado en programación web, con posts de opinión y experiencias personales. La estética debe transmitir: **oscuro, técnico, compacto, con personalidad**. Referencia mental: una terminal prolija con toques de color vivos, no un dashboard aburrido ni una landing corporativa.

- **Modo:** oscuro únicamente. No implementar toggle de light mode.
- **Sensación:** terminal / changelog / editor de código, no "blog editorial" clásico.
- **Animaciones:** sutiles. Transiciones suaves en hover, nada llamativo ni con personalidad tipo Klarna. Rendimiento y limpieza por encima de efectos.

## 2. Paleta de colores

Base oscura neutra con dos acentos vivos (naranja y azul), cada uno con un rol distinto para que no compitan entre sí.

```css
:root {
  /* Fondos */
  --bg-primary: #0a0a0f;      /* fondo general, casi negro con tinte frío */
  --bg-secondary: #12121a;    /* cards, code blocks, header/footer */
  --bg-hover: #1a1a24;        /* hover de items de lista */

  /* Texto */
  --text-primary: #e4e4e7;    /* texto principal */
  --text-secondary: #9b9ba5;  /* metadata, descripciones */
  --text-dim: #52525b;        /* texto terciario, timestamps viejos */

  /* Acentos */
  --accent-orange: #ff6b35;   /* CTA, links activos, hover principal, cursor */
  --accent-blue: #4a9eff;     /* tags, metadata técnica, syntax highlight */

  /* Bordes y separadores */
  --border: #27272e;
  --border-hover: #3a3a44;

  /* Código */
  --code-bg: #0d0d12;
  --code-border: #1f1f28;
}
```

**Regla de uso:** el naranja es el color de acción (links, hover, cursor parpadeante, botón/CTA). El azul es el color de metadata (tags, fechas destacadas, syntax highlighting de código). No mezclar roles.

## 3. Tipografía

Todo en monoespaciada — títulos, body y metadata. Es una decisión de identidad, no solo de code blocks.

```css
--font-mono: 'JetBrains Mono', 'Fira Code', 'IBM Plex Mono', ui-monospace, monospace;
```

- **Body de artículos:** `font-size: 16px`, `line-height: 1.7`. La monoespaciada compacta necesita más interlineado del habitual para no cansar en textos largos.
- **Títulos (h1/h2/h3):** mismo font-mono, peso `600-700`, sin tracking negativo (la mono ya es angosta).
- **Metadata (fechas, tags, reading time):** `font-size: 13-14px`, `color: var(--text-secondary)`.
- **Evitar:** letras muy grandes tipo editorial (nada de h1 gigante estilo Klarna). Los títulos deben sentirse como un nombre de archivo o un commit, no como una portada de revista.

## 4. Layout — Home (listado de posts)

Formato lista tipo terminal/changelog, sin cards ni imágenes destacadas.

```
~/blog $

2026-07-05  Cómo armé Ryu con TypeScript y Ink        #typescript #ai      4 min
2026-06-20  Notas sobre Drizzle y migraciones          #drizzle #db        6 min
2026-05-12  Por qué elegí Hono sobre Express           #backend #opinión   3 min
```

- Cada fila: `fecha` (dim) + `título` (text-primary, orange en hover) + `tags` (blue, tamaño chico) + `tiempo de lectura` (dim, alineado a la derecha).
- Fecha en formato `YYYY-MM-DD` — refuerza la estética técnica.
- Hover de fila: `background: var(--bg-hover)` + el título pasa a `var(--accent-orange)`. Transición `150-200ms ease`.
- Sin paginación numérica tradicional — usar `<- anteriores` / `siguientes ->` en estilo terminal si hace falta paginar.
- Header opcional tipo prompt: `~/blog $` con un cursor parpadeante en naranja (`::after` con `animation: blink 1s step-end infinite`) — es el único elemento con animación "con personalidad", todo lo demás sutil.

## 5. Layout — Página de post individual

- Metadata arriba del título: fecha + tags + tiempo de lectura, mismo estilo que en la lista.
- Título del post: mono, peso 700, tamaño moderado (no gigante).
- Body: line-height generoso (1.7-1.8), ancho máximo de columna ~680-720px para no perder legibilidad en mono.
- Links dentro del artículo: `color: var(--accent-orange)`, subrayado sutil que se intensifica en hover (transición de `text-decoration-color` o `border-bottom`).
- Code blocks: `background: var(--code-bg)`, `border: 1px solid var(--code-border)`, `border-radius: 6px`. Syntax highlighting con tema oscuro cuyo acento de keywords/strings use `var(--accent-blue)` y comentarios en `var(--text-dim)`.
- Al final del post: navegación simple "post anterior / post siguiente" en el mismo estilo de fila que la home.

## 6. Header y footer

- **Header:** minimalista — nombre del blog (o el prompt `~/blog $`) a la izquierda, nav con 2-3 links (Posts, Tags, Sobre mí) a la derecha. Sin sombras, `border-bottom: 1px solid var(--border)`.
- **Footer:** una línea, dim, con año + links a GitHub/redes. Nada de columnas ni grillas grandes.

## 7. Microinteracciones (nivel: sutil)

- Hover de links y filas: `transition: background-color 150ms ease, color 150ms ease`.
- Cursor parpadeante en el prompt del header (única excepción "con personalidad").
- Sin parallax, sin scroll-triggered animations, sin efectos de entrada tipo fade-in masivo. Si se agrega algo de scroll, que sea un simple fade sutil (`opacity` + `translateY(4px)`, 200ms) y nada más.

## 8. Accesibilidad y performance

- Contraste mínimo AA entre `--text-primary`/`--text-secondary` y `--bg-primary`.
- `prefers-reduced-motion`: desactivar el blink del cursor y cualquier transición no esencial.
- Fuente mono vía `font-display: swap` y self-hosted o Google Fonts con preconnect, para no penalizar el LCP de Astro.