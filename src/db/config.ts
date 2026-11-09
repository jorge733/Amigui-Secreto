/**
 * Conexión a la base de datos.
 * Acepta los nombres que crea la integración de Turso en Vercel
 * (TURSO_DATABASE_URL / TURSO_AUTH_TOKEN) o los propios de la app.
 * Sin ninguno, usa un archivo local para desarrollo.
 */
export const dbCredentials = {
  url: process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL ?? "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN ?? process.env.DATABASE_AUTH_TOKEN,
};
