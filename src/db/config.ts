/**
 * Conexión a la base de datos.
 *
 * La integración de Turso en Vercel crea las variables con un prefijo
 * configurable (por ejemplo DATABASE_TURSO_DATABASE_URL), así que se
 * acepta cualquier variable que termine en TURSO_DATABASE_URL /
 * TURSO_AUTH_TOKEN. También sirven DATABASE_URL / DATABASE_AUTH_TOKEN.
 * Sin ninguna, se usa un archivo local para desarrollo.
 */
function findEnv(suffix: string) {
  const key = Object.keys(process.env)
    .filter((k) => k.endsWith(suffix) && process.env[k])
    .sort((a, b) => a.length - b.length)[0];
  return key ? process.env[key] : undefined;
}

export const dbCredentials = {
  url: findEnv("TURSO_DATABASE_URL") ?? process.env.DATABASE_URL ?? "file:local.db",
  authToken: findEnv("TURSO_AUTH_TOKEN") ?? process.env.DATABASE_AUTH_TOKEN,
};
