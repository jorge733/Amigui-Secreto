import "server-only";
import { drizzle } from "drizzle-orm/libsql";
import { dbCredentials } from "./config";
import * as schema from "./schema";

export const db = drizzle({
  connection: dbCredentials,
  schema,
});

export { schema };
