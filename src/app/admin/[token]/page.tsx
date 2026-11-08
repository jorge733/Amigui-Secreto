import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { removeExclusion, removeParticipant, resetDraw } from "@/app/actions";
import { AddParticipantForm } from "@/components/admin/add-participant-form";
import { DrawButton } from "@/components/admin/draw-button";
import { EditGroupForm } from "@/components/admin/edit-group-form";
import { ExclusionForm } from "@/components/admin/exclusion-form";
import { ConfirmSubmit } from "@/components/confirm-submit";
import { CopyButton } from "@/components/copy-button";
import { GroupSummary } from "@/components/group-summary";
import type { ExclusionRow, Group, Participant } from "@/db/schema";
import { getOrigin } from "@/lib/origin";
import { getGroupByAdminToken } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Organizar · Amigui Secreto",
  referrer: "no-referrer",
};

// Página privada: siempre se renderiza al momento, nunca desde caché.
export const dynamic = "force-dynamic";

export default async function AdminPage({ params }: PageProps<"/admin/[token]">) {
  const { token } = await params;
  const data = await getGroupByAdminToken(token);
  if (!data) notFound();

  const { group, participants, exclusions } = data;
  const origin = await getOrigin();
  const adminUrl = `${origin}/admin/${token}`;

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <p className="eyebrow">Panel de organizador</p>
        <GroupSummary group={group} />
      </div>

      <section className="rounded-2xl border border-dashed border-border p-4 text-sm">
        <p className="font-medium">Guarda este enlace: es tu acceso de organizador.</p>
        <p className="mt-1 text-muted">No lo compartas. Quien lo tenga puede editar el grupo.</p>
        <div className="mt-3 flex gap-2">
          <code className="input truncate font-mono text-xs leading-6">{adminUrl}</code>
          <CopyButton text={adminUrl} className="btn-secondary shrink-0" />
        </div>
      </section>

      {group.drawnAt ? (
        <DrawnView group={group} participants={participants} origin={origin} token={token} />
      ) : (
        <SetupView participants={participants} exclusions={exclusions} token={token} />
      )}

      <details className="group card">
        <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
          Editar detalles del grupo
          <span className="text-muted transition group-open:rotate-45" aria-hidden>
            +
          </span>
        </summary>
        <div className="mt-5">
          <EditGroupForm adminToken={token} group={group} />
        </div>
      </details>
    </div>
  );
}

function SetupView({
  participants,
  exclusions,
  token,
}: {
  participants: Participant[];
  exclusions: ExclusionRow[];
  token: string;
}) {
  const nameOf = new Map(participants.map((p) => [p.id, p.name]));
  const people = participants.map(({ id, name }) => ({ id, name }));

  return (
    <>
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Participantes</h2>
          <span className="text-sm text-muted">{participants.length}</span>
        </div>
        <div className="card space-y-4">
          <AddParticipantForm adminToken={token} />
          {participants.length > 0 ? (
            <ul className="divide-y divide-border">
              {participants.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2">
                  <span>{p.name}</span>
                  <form action={removeParticipant.bind(null, token, p.id)}>
                    <button type="submit" className="btn-ghost text-xs" aria-label={`Quitar a ${p.name}`}>
                      Quitar
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Aún no hay nadie. No olvides agregarte si también participas.</p>
          )}
        </div>
      </section>

      {participants.length >= 2 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Restricciones</h2>
            <p className="text-sm text-muted">
              Opcional. Útil para parejas o para no repetir el año anterior.
            </p>
          </div>
          <div className="card space-y-4">
            <ExclusionForm adminToken={token} people={people} />
            {exclusions.length > 0 && (
              <ul className="divide-y divide-border border-t border-border">
                {exclusions.map((e) => (
                  <li key={e.id} className="flex items-center justify-between py-2 text-sm">
                    <span>
                      {nameOf.get(e.giverId)} <span className="text-muted">no le regala a</span>{" "}
                      {nameOf.get(e.receiverId)}
                    </span>
                    <form action={removeExclusion.bind(null, token, e.id)}>
                      <button type="submit" className="btn-ghost text-xs">
                        Quitar
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      <section>
        <DrawButton adminToken={token} count={participants.length} />
      </section>
    </>
  );
}

function DrawnView({
  group,
  participants,
  origin,
  token,
}: {
  group: Group;
  participants: Participant[];
  origin: string;
  token: string;
}) {
  const revealed = participants.filter((p) => p.revealedAt).length;

  return (
    <section className="space-y-4">
      <div className="rounded-2xl bg-accent-soft p-5">
        <h2 className="text-lg font-semibold">¡Sorteo realizado!</h2>
        <p className="mt-1 text-sm text-muted">
          Envíale a cada persona su enlace privado. Al abrirlo verá solo a quién le regala. Tú tampoco lo
          sabes.
        </p>
      </div>

      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Enlaces personales</h2>
        <span className="text-sm text-muted">
          {revealed} de {participants.length} ya vieron su resultado
        </span>
      </div>

      <ul className="card divide-y divide-border py-1 sm:py-1">
        {participants.map((p) => {
          const url = `${origin}/p/${p.token}`;
          const message = `¡Hola ${p.name}! 🎁 Este es tu enlace secreto para el amigo secreto "${group.name}": ${url}`;
          return (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted">{p.revealedAt ? "✓ Ya lo vio" : "Pendiente"}</p>
              </div>
              <div className="flex gap-2">
                <CopyButton text={url} label="Copiar enlace" />
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  WhatsApp
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      <form action={resetDraw.bind(null, token)} className="pt-2 text-center">
        <ConfirmSubmit
          message="¿Deshacer el sorteo? Las asignaciones actuales se borrarán y tendrás que sortear de nuevo. Quienes ya vieron su resultado deberán volver a revisarlo."
          className="btn-ghost text-xs"
          pendingLabel="Deshaciendo…"
        >
          Deshacer sorteo para editar la lista
        </ConfirmSubmit>
      </form>
    </section>
  );
}
