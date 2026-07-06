import { CONTENT } from '../config';

export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  pubDatetime: Date;
  body: string;
}

/**
 * Normaliza un término de búsqueda (lowercase, trim)
 */
export function normalizeQuery(query: string): string {
  return query.toLowerCase().trim();
}

/**
 * Resalta las coincidencias de búsqueda en un texto
 * Devuelve HTML con spans para resaltar
 */
export function highlightMatch(text: string, query: string): string {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<span class="text-[var(--accent-orange)]">$1</span>');
}

/**
 * Calcula el tiempo de lectura para búsquedas client-side
 */
export function getReadingTimeForSearch(body: string, wordsPerMinute: number = CONTENT.wordsPerMinute): number {
  const words = body.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Filtra posts según un término de búsqueda
 */
export function filterPostsByQuery(posts: SearchResult[], query: string): SearchResult[] {
  const normalizedQuery = normalizeQuery(query);
  
  if (!normalizedQuery) return [];
  
  return posts.filter(post => 
    post.title.toLowerCase().includes(normalizedQuery) ||
    post.description.toLowerCase().includes(normalizedQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
  );
}

/**
 * Formatea una fecha ISO para mostrar en resultados de búsqueda
 */
export function formatDateForSearch(dateString: Date): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}
