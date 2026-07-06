// =============================================================================
// TIPOS
// =============================================================================

export interface SiteConfig {
  url: string;
  author: string;
  title: string;
  lang: string;
  defaultDescription: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  instagram: string;
}

export interface NavigationConfig {
  home: string;
  posts: string;
  search: string;
  about: string;
}

export interface NavigationLabels {
  posts: string;
  search: string;
  about: string;
  all: string;
  previous: string;
  next: string;
  backToPosts: string;
}

export interface ContentConfig {
  wordsPerMinute: number;
  defaultTags: string[];
  maxTagsInList: number;
  maxTagsInCard: number;
  dateFormat: string;
}

export interface AssetPaths {
  faviconSvg: string;
  faviconIco: string;
  profilePhotos: string[];
}

export interface UIMessages {
  emptyPosts: string;
  emptySearch: string;
  emptyTag: string;
  searchPrompt: string;
}

export interface AnimationConfig {
  pressDuration: number;
}

export interface ExternalUrls {
  googleFontsPreconnect: string;
  googleFontsGStatic: string;
  googleFontsStylesheet: string;
}

// =============================================================================
// CONSTANTES
// =============================================================================

/**
 * Configuración general del sitio
 */
export const SITE: SiteConfig = {
  url: "https://blog.beresiarte.xyz",
  author: "Juan Beresiarte",
  title: "~/blog",
  lang: "es",
  defaultDescription: "Blog técnico sobre desarrollo web y experiencias personales",
};

/**
 * Enlaces a redes sociales
 */
export const SOCIAL: SocialLinks = {
  github: "https://github.com/beresiarte",
  linkedin: "https://linkedin.com/in/beresiarte",
  instagram: "https://instagram.com/beresiarte",
};

/**
 * Rutas de navegación internas
 */
export const ROUTES: NavigationConfig = {
  home: "/",
  posts: "/blog",
  search: "/buscar",
  about: "/sobre-mi",
};

/**
 * Etiquetas de texto para la navegación
 */
export const NAV_LABELS: NavigationLabels = {
  posts: "posts",
  search: "buscar",
  about: "sobre-mi",
  all: "todos",
  previous: "anterior",
  next: "siguiente",
  backToPosts: "volver a posts",
};

/**
 * Prefijos de prompt tipo terminal
 */
export const TERMINAL_PROMPTS = {
  home: "~/blog $",
  posts: "~/blog/posts $",
  about: "~/blog/sobre-mi $",
  search: "~/blog/buscar $",
  tag: (tag: string) => `~/blog/tag/${tag} $`,
};

/**
 * Configuración de contenido
 */
export const CONTENT: ContentConfig = {
  wordsPerMinute: 200,
  defaultTags: ["others"],
  maxTagsInList: 3,
  maxTagsInCard: 4,
  dateFormat: "yyyy-MM-dd",
};

/**
 * Rutas a assets estáticos
 */
export const ASSETS: AssetPaths = {
  faviconSvg: "/favicon.svg",
  faviconIco: "/favicon.ico",
  profilePhotos: [
    "/profile_photo.jpeg",
    "/profile_photo_2.png",
    "/profile_photo_3.jpeg",
  ],
};

/**
 * Mensajes de UI
 */
export const MESSAGES: UIMessages = {
  emptyPosts: "No hay posts publicados todavía.",
  emptySearch: "No se encontraron resultados.",
  emptyTag: "No hay artículos con este tag.",
  searchPrompt: "Escribe para buscar artículos...",
};

/**
 * Configuración de animaciones
 */
export const ANIMATION: AnimationConfig = {
  pressDuration: 150,
};

/**
 * URLs externas
 */
export const EXTERNAL: ExternalUrls = {
  googleFontsPreconnect: "https://fonts.googleapis.com",
  googleFontsGStatic: "https://fonts.gstatic.com",
  googleFontsStylesheet:
    "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap",
};

/**
 * Utilidades de formato de fecha
 * Nota: Para usar con date-fns, usar CONTENT.dateFormat
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Calcula el tiempo de lectura de un texto
 */
export function getReadingTime(body: string, wordsPerMinute: number = CONTENT.wordsPerMinute): number {
  const words = body.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Genera el título de página
 */
export function getPageTitle(title?: string): string {
  return title ? `${title} | ${SITE.title}` : SITE.title;
}
