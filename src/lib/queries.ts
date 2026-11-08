import "server-only";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";

const { groups, participants, exclusions } = schema;

export async function getGroupByAdminToken(adminToken: string) {
  const group = await db.query.groups.findFirst({
    where: eq(groups.adminToken, adminToken),
  });
  if (!group) return null;

  const [members, rules] = await Promise.all([
    db
      .select()
      .from(participants)
      .where(eq(participants.groupId, group.id))
      .orderBy(asc(participants.createdAt), asc(participants.name)),
    db.select().from(exclusions).where(eq(exclusions.groupId, group.id)),
  ]);

  return { group, participants: members, exclusions: rules };
}

export async function getParticipantView(token: string) {
  const me = await db.query.participants.findFirst({
    where: eq(participants.token, token),
  });
  if (!me) return null;

  const group = await db.query.groups.findFirst({
    where: eq(groups.id, me.groupId),
  });
  if (!group) return null;

  const receiver = me.receiverId
    ? await db.query.participants.findFirst({
        where: eq(participants.id, me.receiverId),
        columns: { name: true, wishlist: true },
      })
    : null;

  return { me, group, receiver: receiver ?? null };
}
