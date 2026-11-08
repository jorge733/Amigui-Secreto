# 🎁 Amigui Secreto

App web para organizar un **amigo secreto**: sorteo justo, enlaces privados por persona y listas de deseos. Sin cuentas ni contraseñas.

## Cómo funciona

1. **Crea un grupo**: nombre, fecha, presupuesto y un mensaje opcional.
2. Recibes un **enlace de organizador** (secreto) para administrarlo.
3. **Agrega participantes** (puedes pegar varios separados por coma).
4. **Restricciones** opcionales: "Ana no le regala a Pedro" (en uno o ambos sentidos).
5. **Sortea**: nadie se regala a sí mismo, se respetan las restricciones y todos dan y reciben un regalo.
6. **Comparte** el enlace personal de cada persona (copiar o WhatsApp). Ni quien organiza sabe los resultados.
7. Cada participante ve a quién le regala, la lista de deseos de esa persona y escribe la suya.
8. El organizador ve quién ya abrió su resultado y puede deshacer el sorteo para editar la lista.

## Tecnología

- [Next.js 16](https://nextjs.org) (App Router, Server Actions) + TypeScript
- Tailwind CSS 4
- [Drizzle ORM](https://orm.drizzle.team) + SQLite ([libsql](https://github.com/tursodatabase/libsql)): un archivo local en desarrollo y [Turso](https://turso.tech) en producción
- Vitest para los tests del algoritmo de sorteo

## Desarrollo local

```bash
npm install
npm run dev        # aplica las migraciones y arranca en http://localhost:3000
```

Otros comandos:

```bash
npm test               # tests del sorteo
npm run lint
npm run build
npm run db:generate    # crea una migración tras cambiar src/db/schema.ts
npm run db:migrate     # aplica migraciones
```

## Variables de entorno

| Variable | Descripción | Por defecto |
|---|---|---|
| `DATABASE_URL` | URL de la base de datos libsql (`file:local.db` o `libsql://…` de Turso) | `file:local.db` |
| `DATABASE_AUTH_TOKEN` | Token de Turso (solo en producción) | — |
| `APP_URL` | URL pública, para construir los enlaces compartidos | se deduce de la petición |

## Estructura

```
src/
  app/
    page.tsx              # inicio + crear grupo
    admin/[token]/        # panel del organizador
    p/[token]/            # página personal de cada participante
    actions.ts            # Server Actions (toda la lógica que escribe datos)
  components/             # UI
  db/                     # esquema y cliente de Drizzle
  lib/draw.ts             # algoritmo del sorteo (+ tests)
drizzle/                  # migraciones SQL
```

## Seguridad

Los enlaces usan tokens aleatorios de 144 bits (participantes) y 192 bits (organizador). Cada acción del servidor verifica el token antes de leer o modificar datos. Quien tenga un enlace tiene acceso a lo que ese enlace permite, así que conviene compartirlos por mensaje privado.
