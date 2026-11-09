import { defineConfig } from "drizzle-kit";
import { dbCredentials } from "./src/db/config";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials,
});
