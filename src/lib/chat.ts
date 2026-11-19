import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";

const { groups, participants, messages } = schema;

export const MESSAGE_MAX_LENGTH = 500;
const THREAD_LIMIT = 300;

/** Mensaje tal como lo ve un participante. Nunca incluye ids de personas. */
export type ChatMessage = { id: string; mine: boolean; body: string; at: number };

export type ChatData = {
  /** Conversación con la persona a quien le regalo (yo soy anónimo). */
  withReceiver: ChatMessage[] | null;
  /** Conversación con quien me regala (esa persona es anónima). */
  withGiver: ChatMessage[] | null;
};

/** Resuelve las dos parejas de chat de un participante a partir de su token. */
export async function getChatContext(token: string) {
  const me = await db.query.participants.findFirst({ where: eq(participants.token, token) });
  if (!me) return null;
  const group = await db.query.groups.findFirst({ where: eq(groups.id, me.groupId) });
  if (!group) return null;
  if (!group.drawnAt) return { me, group, receiverId: null, giverId: null };

  const giver = await db.query.participants.findFirst({
    where: and(eq(participants.groupId, group.id), eq(participants.receiverId, me.id)),
    columns: { id: true },
  });
  return { me, group, receiverId: me.receiverId, giverId: giver?.id ?? null };
}

async function readThread(giverId: string, receiverId: string, iAmGiver: boolean) {
  const rows = await db
    .select({
      id: messages.id,
      fromGiver: messages.fromGiver,
      body: messages.body,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(and(eq(messages.giverId, giverId), eq(messages.receiverId, receiverId)))
    .orderBy(asc(messages.createdAt))
    .limit(THREAD_LIMIT);

  return rows.map((m) => ({
    id: m.id,
    mine: m.fromGiver === iAmGiver,
    body: m.body,
    at: m.createdAt.getTime(),
  }));
}

export async function getChat(token: string): Promise<ChatData | null> {
  const ctx = await getChatContext(token);
  if (!ctx) return null;
  const { me, receiverId, giverId } = ctx;

  const [withReceiver, withGiver] = await Promise.all([
    receiverId ? readThread(me.id, receiverId, true) : null,
    giverId ? readThread(giverId, me.id, false) : null,
  ]);
  return { withReceiver, withGiver };
}
