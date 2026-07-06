import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Validar variables de entorno
const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL) {
  throw new Error('TURSO_DATABASE_URL no está definido en las variables de entorno');
}

if (!TURSO_AUTH_TOKEN) {
  throw new Error('TURSO_AUTH_TOKEN no está definido en las variables de entorno');
}

// Crear cliente de libsql
const client = createClient({
  url: TURSO_DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
});

// Crear instancia de drizzle con el cliente
export const db = drizzle({ client, schema });

// Exportar schema para usar en queries
export { schema };

// Exportar cliente para casos específicos
export { client };

// Función helper para verificar la conexión (útil en Vercel)
export async function checkConnection() {
  try {
    // Hacer una query simple para verificar conexión
    await client.execute('SELECT 1');
    return { success: true, message: 'Conexión exitosa a Turso' };
  } catch (error) {
    console.error('Error al conectar con Turso:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
