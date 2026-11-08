"use server";

import { and, eq, isNull, or } from "drizzle-orm";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { drawAssignments, MIN_PARTICIPANTS } from "@/lib/draw";
import { newId, newToken } from "@/lib/tokens";

const { groups, participants, exclusions } = schema;

export type ActionState = { error?: string; ok?: boolean };

const LIMITS = { name: 80, short: 60, message: 500, wishlist: 1000 };
const MAX_PARTICIPANTS = 100;

function text(formData: FormData, key: string, max: number) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Toda acción de administración verifica el token antes de hacer nada. */
async function requireGroup(adminToken: string) {
  const group = await db.query.groups.findFirst({
    where: eq(groups.adminToken, adminToken),
  });
  if (!group) throw new Error("Grupo no encontrado");
  return group;
}

async function requireEditableGroup(adminToken: string) {
  const group = await requireGroup(adminToken);
  if (group.drawnAt) {
    throw new Error("El sorteo ya se realizó. Deshazlo para hacer cambios.");
  }
  return group;
}

// ─── Grupo ───────────────────────────────────────────────────────────────

export async function createGroup(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = text(formData, "name", LIMITS.name);
  if (!name) return { error: "Ponle un nombre al grupo." };

  const adminToken = newToken(24);
  await db.insert(groups).values({
    id: newId(),
    name,
    eventDate: text(formData, "eventDate", 10) || null,
    budget: text(formData, "budget", LIMITS.short) || null,
    message: text(formData, "message", LIMITS.message) || null,
    adminToken,
  });

  redirect(`/admin/${adminToken}`);
}

export async function updateGroup(
  adminToken: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const group = await requireGroup(adminToken);
  const name = text(formData, "name", LIMITS.name);
  if (!name) return { error: "El nombre no puede quedar vacío." };

  await db
    .update(groups)
    .set({
      name,
      eventDate: text(formData, "eventDate", 10) || null,
      budget: text(formData, "budget", LIMITS.short) || null,
      message: text(formData, "message", LIMITS.message) || null,
    })
    .where(eq(groups.id, group.id));

  refresh();
  return { ok: true };
}

// ─── Participantes ───────────────────────────────────────────────────────

export async function addParticipant(
  adminToken: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const group = await requireEditableGroup(adminToken);

  // Permite pegar varios nombres separados por comas o saltos de línea.
  const names = text(formData, "name", 4000)
    .split(/[\n,]/)
    .map((n) => n.trim().slice(0, LIMITS.name))
    .filter(Boolean);
  if (names.length === 0) return { error: "Escribe un nombre." };

  const existing = await db
    .select({ name: participants.name })
    .from(participants)
    .where(eq(participants.groupId, group.id));

  if (existing.length + names.length > MAX_PARTICIPANTS) {
    return { error: `El máximo es ${MAX_PARTICIPANTS} participantes.` };
  }

  const seen = new Set(existing.map((p) => p.name.toLocaleLowerCase("es")));
  for (const n of names) {
    const key = n.toLocaleLowerCase("es");
    if (seen.has(key)) {
      return { error: `"${n}" ya está en el grupo. Usa nombres distintos.` };
    }
    seen.add(key);
  }

  await db.insert(participants).values(
    names.map((n) => ({
      id: newId(),
      groupId: group.id,
      name: n,
      token: newToken(),
    })),
  );

  refresh();
  return { ok: true };
}

export async function removeParticipant(adminToken: string, participantId: string) {
  const group = await requireEditableGroup(adminToken);
  await db.transaction(async (tx) => {
    await tx
      .delete(exclusions)
      .where(
        and(
          eq(exclusions.groupId, group.id),
          or(
            eq(exclusions.giverId, participantId),
            eq(exclusions.receiverId, participantId),
          ),
        ),
      );
    await tx
      .delete(participants)
      .where(and(eq(participants.id, participantId), eq(participants.groupId, group.id)));
  });
  refresh();
}

// ─── Exclusiones ─────────────────────────────────────────────────────────

export async function addExclusion(
  adminToken: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const group = await requireEditableGroup(adminToken);
  const giverId = text(formData, "giverId", 64);
  const receiverId = text(formData, "receiverId", 64);
  const bothWays = formData.get("bothWays") === "on";

  if (!giverId || !receiverId) return { error: "Elige a las dos personas." };
  if (giverId === receiverId) return { error: "Elige dos personas distintas." };

  const members = await db
    .select({ id: participants.id })
    .from(participants)
    .where(eq(participants.groupId, group.id));
  const ids = new Set(members.map((m) => m.id));
  if (!ids.has(giverId) || !ids.has(receiverId)) {
    return { error: "Participante no válido." };
  }

  const current = await db
    .select()
    .from(exclusions)
    .where(eq(exclusions.groupId, group.id));
  const exists = (g: string, r: string) =>
    current.some((e) => e.giverId === g && e.receiverId === r);

  const pairs: [string, string][] = [[giverId, receiverId]];
  if (bothWays) pairs.push([receiverId, giverId]);
  const toInsert = pairs.filter(([g, r]) => !exists(g, r));

  if (toInsert.length === 0) return { error: "Esa restricción ya existe." };

  await db.insert(exclusions).values(
    toInsert.map(([g, r]) => ({
      id: newId(),
      groupId: group.id,
      giverId: g,
      receiverId: r,
    })),
  );

  refresh();
  return { ok: true };
}

export async function removeExclusion(adminToken: string, exclusionId: string) {
  const group = await requireEditableGroup(adminToken);
  await db
    .delete(exclusions)
    .where(and(eq(exclusions.id, exclusionId), eq(exclusions.groupId, group.id)));
  refresh();
}

// ─── Sorteo ──────────────────────────────────────────────────────────────

export async function runDraw(adminToken: string): Promise<ActionState> {
  const group = await requireEditableGroup(adminToken);

  const [members, rules] = await Promise.all([
    db.select().from(participants).where(eq(participants.groupId, group.id)),
    db.select().from(exclusions).where(eq(exclusions.groupId, group.id)),
  ]);

  if (members.length < MIN_PARTICIPANTS) {
    return { error: `Se necesitan al menos ${MIN_PARTICIPANTS} participantes.` };
  }

  const assignment = drawAssignments(
    members.map((m) => m.id),
    rules,
  );
  if (!assignment) {
    return {
      error:
        "Con estas restricciones no hay ninguna combinación posible. Quita alguna e inténtalo de nuevo.",
    };
  }

  await db.transaction(async (tx) => {
    // Marcar el grupo como sorteado solo si no lo estaba (evita doble sorteo).
    const updated = await tx
      .update(groups)
      .set({ drawnAt: new Date() })
      .where(and(eq(groups.id, group.id), isNull(groups.drawnAt)))
      .returning({ id: groups.id });
    if (updated.length === 0) return;

    for (const [giverId, receiverId] of assignment) {
      await tx
        .update(participants)
        .set({ receiverId, revealedAt: null })
        .where(eq(participants.id, giverId));
    }
  });

  refresh();
  return { ok: true };
}

export async function resetDraw(adminToken: string) {
  const group = await requireGroup(adminToken);
  await db.transaction(async (tx) => {
    await tx.update(groups).set({ drawnAt: null }).where(eq(groups.id, group.id));
    await tx
      .update(participants)
      .set({ receiverId: null, revealedAt: null })
      .where(eq(participants.groupId, group.id));
  });
  refresh();
}

// ─── Participante ────────────────────────────────────────────────────────

async function requireParticipant(token: string) {
  const me = await db.query.participants.findFirst({
    where: eq(participants.token, token),
  });
  if (!me) throw new Error("Enlace no válido");
  return me;
}

export async function saveWishlist(
  token: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const me = await requireParticipant(token);
  await db
    .update(participants)
    .set({ wishlist: text(formData, "wishlist", LIMITS.wishlist) })
    .where(eq(participants.id, me.id));
  refresh();
  return { ok: true };
}

export async function markRevealed(token: string) {
  const me = await requireParticipant(token);
  if (me.receiverId && !me.revealedAt) {
    await db
      .update(participants)
      .set({ revealedAt: new Date() })
      .where(eq(participants.id, me.id));
  }
}
