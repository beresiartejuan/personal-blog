// Genera un identificador anónimo único de 32 caracteres hexadecimales
export function generateAnonymousId(): string {
  return crypto.randomUUID();
}

// Obtiene o genera el anonymousId de la cookie
export function getAnonymousId(): string {
  if (typeof document === "undefined") return "";
  
  const cookieName = "blog_anonymous_id";
  const cookies = document.cookie.split(";");
  
  // Buscar cookie existente
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === cookieName && value) {
      return value;
    }
  }
  
  // Generar nuevo ID si no existe
  const newId = generateAnonymousId();
  
  // Guardar en cookie por 1 año
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  
  document.cookie = `${cookieName}=${newId};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  
  return newId;
}

// Verifica si el anonymousId actual coincide con el de un comentario
export function isCurrentUser(anonymousId: string): boolean {
  return getAnonymousId() === anonymousId;
}

// Genera URL del avatar de DiceBear basado en el anonymousId
export function getAvatarUrl(anonymousId: string): string {
  return `https://api.dicebear.com/10.x/lorelei-neutral/svg?seed=${encodeURIComponent(anonymousId)}`;
}