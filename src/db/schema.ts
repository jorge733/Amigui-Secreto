import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const createdAt = () =>
  integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`);

export const groups = sqliteTable("groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  eventDate: text("event_date"),
  budget: text("budget"),
  message: text("message"),
  /** Token secreto del enlace de administración. */
  adminToken: text("admin_token").notNull().unique(),
  drawnAt: integer("drawn_at", { mode: "timestamp" }),
  createdAt: createdAt(),
});

export const participants = sqliteTable("participants", {
  id: text("id").primaryKey(),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  /** Token secreto del enlace personal. */
  token: text("token").notNull().unique(),
  wishlist: text("wishlist").notNull().default(""),
  /** A quién le regala (se llena al sortear). */
  receiverId: text("receiver_id"),
  /** Cuándo abrió su resultado por primera vez. */
  revealedAt: integer("revealed_at", { mode: "timestamp" }),
  createdAt: createdAt(),
});

export const exclusions = sqliteTable("exclusions", {
  id: text("id").primaryKey(),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  giverId: text("giver_id")
    .notNull()
    .references(() => participants.id, { onDelete: "cascade" }),
  receiverId: text("receiver_id")
    .notNull()
    .references(() => participants.id, { onDelete: "cascade" }),
});

export type Group = typeof groups.$inferSelect;
export type Participant = typeof participants.$inferSelect;
export type ExclusionRow = typeof exclusions.$inferSelect;

/**
 * Mensajes del chat anónimo. Cada conversación es entre quien regala
 * (anónimo) y quien recibe; se identifica por el par giverId → receiverId.
 */
export const messages = sqliteTable(
  "messages",
  {
    id: text("id").primaryKey(),
    groupId: text("group_id")
      .notNull()
      .references(() => groups.id, { onDelete: "cascade" }),
    giverId: text("giver_id")
      .notNull()
      .references(() => participants.id, { onDelete: "cascade" }),
    receiverId: text("receiver_id")
      .notNull()
      .references(() => participants.id, { onDelete: "cascade" }),
    /** true si lo escribió quien regala; false si lo escribió quien recibe. */
    fromGiver: integer("from_giver", { mode: "boolean" }).notNull(),
    body: text("body").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (t) => [index("messages_thread_idx").on(t.giverId, t.receiverId, t.createdAt)],
);

export type Message = typeof messages.$inferSelect;
