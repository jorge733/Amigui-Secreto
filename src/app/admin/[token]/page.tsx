import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { removeExclusion, removeParticipant, resetDraw } from "@/app/actions";
import { AddParticipantForm } from "@/components/admin/add-participant-form";
import { DrawButton } from "@/components/admin/draw-button";
import { EditGroupForm } from "@/components/admin/edit-group-form";
import { ExclusionForm } from "@/components/admin/exclusion-form";
import { Avatar } from "@/components/avatar";
import { ConfirmSubmit } from "@/components/confirm-submit";
import { CopyButton } from "@/components/copy-button";
import { GroupSummary } from "@/components/group-summary";
import { BanIcon, CheckIcon, LockIcon, UndoIcon, WhatsAppIcon, XIcon } from "@/components/icons";
import type { ExclusionRow, Group, Participant } from "@/db/schema";
import { MIN_PARTICIPANTS } from "@/lib/draw";
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
      <div className="space-y-4">
        <p className="eyebrow">Panel de organizador</p>
        <GroupSummary group={group} />
      </div>

      <Progress step={group.drawnAt ? 3 : participants.length >= MIN_PARTICIPANTS ? 2 : 1} />

      <section className="flex gap-3 rounded-2xl border border-gold/30 bg-gold-soft p-4 text-sm sm:p-5">
        <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold-ink">
          <LockIcon size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium">Guarda este enlace: es tu acceso de organizador.</p>
          <p className="mt-0.5 text-muted">No lo compartas. Quien lo tenga puede editar el grupo.</p>
          <div className="mt-3 flex gap-2">
            <code className="input min-w-0 truncate bg-surface py-2 font-mono text-xs leading-6">{adminUrl}</code>
            <CopyButton text={adminUrl} className="btn-secondary shrink-0" />
          </div>
        </div>
      </section>

      {group.drawnAt ? (
        <DrawnView group={group} participants={participants} origin={origin} token={token} />
      ) : (
        <SetupView participants={participants} exclusions={exclusions} token={token} />
      )}

      <details className="group card">
        <summary className="flex cursor-pointer list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden">
          Editar detalles del grupo
          <span
            className="inline-flex size-7 items-center justify-center rounded-full bg-foreground/5 text-muted transition group-open:rotate-45"
            aria-hidden
          >
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

const STEPS = ["Participantes", "Restricciones", "Sorteo"];

function Progress({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-2 text-xs font-medium sm:text-sm" aria-label="Progreso">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < step || step === 3;
        const current = n === step && step !== 3;
        return (
          <li key={label} className="flex flex-1 items-center gap-2" aria-current={current ? "step" : undefined}>
            <span
              className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs ${
                done
                  ? "bg-pine text-background"
                  : current
                    ? "bg-accent text-accent-contrast"
                    : "border border-border bg-surface text-muted"
              }`}
            >
              {done ? <CheckIcon size={13} strokeWidth={3} /> : n}
            </span>
            <span className={current || done ? "text-foreground" : "text-muted"}>{label}</span>
            {n < STEPS.length && <span className="h-px flex-1 bg-border" aria-hidden />}
          </li>
        );
      })}
    </ol>
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
        <div className="flex items-center justify-between">
          <h2 className="section-title">Participantes</h2>
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-sm font-semibold text-accent tabular-nums">
            {participants.length}
          </span>
        </div>
        <div className="card space-y-4">
          <AddParticipantForm adminToken={token} />
          {participants.length > 0 ? (
            <ul className="grid gap-2 sm:grid-cols-2">
              {participants.map((p) => (
                <li
                  key={p.id}
                  className="group flex animate-fade-up items-center gap-3 rounded-xl border border-border bg-background py-2 pr-2 pl-2.5"
                >
                  <Avatar name={p.name} size="sm" />
                  <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
                  <form action={removeParticipant.bind(null, token, p.id)}>
                    <button
                      type="submit"
                      className="btn-ghost p-1.5 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
                      aria-label={`Quitar a ${p.name}`}
                      title="Quitar"
                    >
                      <XIcon size={16} />
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
              <p className="text-3xl" aria-hidden>
                👋
              </p>
              <p className="mt-2 text-sm text-muted">Aún no hay nadie. No olvides agregarte si también participas.</p>
            </div>
          )}
        </div>
      </section>

      {participants.length >= 2 && (
        <section className="space-y-4">
          <div>
            <h2 className="section-title">Restricciones</h2>
            <p className="text-sm text-muted">
              Opcional. Útil para parejas o para no repetir el año anterior.
            </p>
          </div>
          <div className="card space-y-4">
            <ExclusionForm adminToken={token} people={people} />
            {exclusions.length > 0 && (
              <ul className="space-y-2 border-t border-border pt-4">
                {exclusions.map((e) => (
                  <li
                    key={e.id}
                    className="flex animate-fade-up items-center gap-2 rounded-xl bg-background py-1.5 pr-1.5 pl-3 text-sm"
                  >
                    <BanIcon size={15} className="shrink-0 text-accent" />
                    <span className="min-w-0 flex-1">
                      <span className="font-medium">{nameOf.get(e.giverId)}</span>{" "}
                      <span className="text-muted">no le regala a</span>{" "}
                      <span className="font-medium">{nameOf.get(e.receiverId)}</span>
                    </span>
                    <form action={removeExclusion.bind(null, token, e.id)}>
                      <button type="submit" className="btn-ghost p-1.5" aria-label="Quitar restricción" title="Quitar">
                        <XIcon size={16} />
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
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-pine p-5 text-background sm:p-6">
        <span className="absolute -top-3 -right-2 text-7xl opacity-25 select-none" aria-hidden>
          🎉
        </span>
        <h2 className="font-display text-2xl font-semibold">¡Sorteo realizado!</h2>
        <p className="mt-1 max-w-md text-sm opacity-85">
          Envíale a cada persona su enlace privado. Al abrirlo verá solo a quién le regala y podrá chatear de forma
          anónima. Tú tampoco lo sabes.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="section-title">Enlaces personales</h2>
          <span className="text-sm text-muted tabular-nums">
            {revealed} de {participants.length} ya lo vieron
          </span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-label="Participantes que ya vieron su resultado"
          aria-valuemin={0}
          aria-valuemax={participants.length}
          aria-valuenow={revealed}
        >
          <div
            className="h-full rounded-full bg-pine transition-[width] duration-700"
            style={{ width: `${participants.length ? (revealed / participants.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <ul className="card divide-y divide-border py-1 sm:py-1">
        {participants.map((p) => {
          const url = `${origin}/p/${p.token}`;
          const message = `¡Hola ${p.name}! 🎁 Este es tu enlace secreto para el amigo secreto "${group.name}": ${url}`;
          return (
            <li key={p.id} className="flex flex-wrap items-center gap-3 py-3">
              <Avatar name={p.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.name}</p>
                {p.revealedAt ? (
                  <p className="inline-flex items-center gap-1 text-xs font-medium text-pine">
                    <CheckIcon size={13} strokeWidth={2.5} /> Ya lo vio
                  </p>
                ) : (
                  <p className="text-xs text-muted">Pendiente</p>
                )}
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <CopyButton text={url} label="Copiar enlace" className="btn-secondary flex-1 sm:flex-none" />
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn flex-1 bg-[#25d366] text-[#0b3d1f] hover:bg-[#1fbe5b] sm:flex-none"
                >
                  <WhatsAppIcon size={16} />
                  WhatsApp
                </a>
              </div>
            </li>
          );
        })}
      </ul>

      <form action={resetDraw.bind(null, token)} className="pt-2 text-center">
        <ConfirmSubmit
          message="¿Deshacer el sorteo? Las asignaciones actuales se borrarán y tendrás que sortear de nuevo. Quienes ya vieron su resultado deberán volver a revisarlo. Los mensajes del chat también se borrarán."
          className="btn-ghost text-xs"
          pendingLabel="Deshaciendo…"
        >
          <UndoIcon size={14} />
          Deshacer sorteo para editar la lista
        </ConfirmSubmit>
      </form>
    </section>
  );
}
