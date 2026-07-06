import { getCollection, render } from 'astro:content';
import { CONTENT } from '../config';

export interface PostSummary {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  pubDatetime: Date;
  modDatetime?: Date;
  body: string;
}

export interface PostWithReadingTime {
  post: any;
  readingTime: number;
}

/**
 * Obtiene todos los posts publicados (sin draft)
 */
export async function getPublishedPosts() {
  const allPosts = await getCollection('blog');
  return allPosts.filter(post => !post.data.draft);
}

/**
 * Obtiene posts ordenados por fecha (más recientes primero)
 */
export async function getSortedPosts() {
  const posts = await getPublishedPosts();
  return posts.sort((a, b) => 
    new Date(b.data.pubDatetime).getTime() - new Date(a.data.pubDatetime).getTime()
  );
}

/**
 * Obtiene todos los tags únicos de los posts
 */
export async function getAllTags() {
  const posts = await getCollection('blog');
  return [...new Set(posts.flatMap(post => post.data.tags || []))].sort();
}

/**
 * Obtiene posts filtrados por tag
 */
export async function getPostsByTag(tag: string) {
  const allPosts = await getPublishedPosts();
  return allPosts
    .filter(post => post.data.tags?.includes(tag))
    .sort((a, b) => new Date(b.data.pubDatetime).getTime() - new Date(a.data.pubDatetime).getTime());
}

/**
 * Obtiene los posts anterior y siguiente dado el slug actual
 */
export async function getPrevNextPosts(currentSlug: string) {
  const sortedPosts = await getSortedPosts();
  const currentIndex = sortedPosts.findIndex(p => p.id === currentSlug);
  
  return {
    prevPost: currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null,
    nextPost: currentIndex > 0 ? sortedPosts[currentIndex - 1] : null,
  };
}

/**
 * Renderiza un post para mostrar su contenido
 */
export async function renderPost(post: any) {
  return await render(post);
}

/**
 * Convierte posts a formato para búsqueda client-side
 */
export async function getPostsForSearch(): Promise<PostSummary[]> {
  const posts = await getSortedPosts();
  return posts.map(post => ({
    slug: post.id,
    title: post.data.title,
    description: post.data.description,
    tags: post.data.tags || [],
    pubDatetime: post.data.pubDatetime,
    modDatetime: post.data.modDatetime,
    body: post.body || '',
  }));
}

/**
 * Cuenta el total de posts publicados
 */
export async function getTotalPostsCount() {
  const posts = await getPublishedPosts();
  return posts.length;
}

/**
 * Calcula el tiempo de lectura de un texto
 */
export function calculateReadingTime(body: string, wordsPerMinute: number = CONTENT.wordsPerMinute): number {
  const words = body.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
