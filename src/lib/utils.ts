import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CONTENT } from '../config';

/**
 * Formatea una fecha a ISO string (YYYY-MM-DD)
 */
export function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Formatea una fecha con un formato específico usando date-fns
 */
export function formatDate(date: Date, dateFormat: string = CONTENT.dateFormat): string {
  return format(new Date(date), dateFormat, { locale: es });
}

/**
 * Calcula el tiempo de lectura de un texto
 */
export function getReadingTime(body: string, wordsPerMinute: number = CONTENT.wordsPerMinute): number {
  const words = body.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Trunca un texto a una longitud máxima
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Genera un slug a partir de un string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Agrupa elementos por una clave
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    result[groupKey] = result[groupKey] || [];
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Obtiene un array único de valores
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}
