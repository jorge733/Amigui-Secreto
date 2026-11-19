"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { sendMessage, type ChatThread } from "@/app/actions";
import type { ChatData, ChatMessage } from "@/lib/chat";

const POLL_MS = 4000;
const MAX_LENGTH = 500;

const THREADS: Record<
  ChatThread,
  { tab: string; them: string; hint: string; empty: string; placeholder: string; key: keyof ChatData }
> = {
  giver: {
    tab: "Quien te regala",
    them: "Tu amigo secreto 🎁",
    hint: "No sabes quién es. Puede preguntarte cosas para acertar con tu regalo.",
    empty: "Aún no hay mensajes. Tu amigo secreto puede escribirte en cualquier momento.",
    placeholder: "Responde a tu amigo secreto…",
    key: "withGiver",
  },
  receiver: {
    tab: "A quien le regalas",
    them: "Tu destinatario",
    hint: "Tú eres anónimo: verá tus mensajes como “Tu amigo secreto”.",
    empty: "Pregúntale su talla, sus gustos o qué no le gusta, sin que sepa que eres tú.",
    placeholder: "Escribe sin revelar quién eres…",
    key: "withReceiver",
  },
};

const timeFormat = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const noopSubscribe = () => () => {};

/** true solo en el navegador: la hora se formatea con la zona horaria local. */
function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function ChatPanel({ token, initial }: { token: string; initial: ChatData }) {
  const [data, setData] = useState(initial);
  const [active, setActive] = useState<ChatThread>("giver");
  const [seen, setSeen] = useState<Record<ChatThread, number>>({
    giver: initial.withGiver?.length ?? 0,
    receiver: initial.withReceiver?.length ?? 0,
  });

  // Conversación abierta, accesible desde la consulta periódica.
  const activeRef = useRef<ChatThread>("giver");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/chat/${token}`, { cache: "no-store" });
      if (!res.ok) return;
      const next: ChatData = await res.json();
      setData(next);
      // Lo que llega a la conversación abierta se da por leído.
      const t = activeRef.current;
      setSeen((s) => ({ ...s, [t]: next[THREADS[t].key]?.length ?? 0 }));
    } catch {
      // Sin conexión: se reintenta en el próximo ciclo.
    }
  }, [token]);

  // Consulta periódica mientras la pestaña está visible.
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") void load();
    };
    const id = setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [load]);

  const count = (t: ChatThread) => data[THREADS[t].key]?.length ?? 0;

  function open(t: ChatThread) {
    activeRef.current = t;
    setActive(t);
    setSeen((s) => ({ ...s, [t]: count(t) }));
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Chat anónimo</h2>
        <p className="text-sm text-muted">Nadie más puede leer estas conversaciones, ni quien organiza.</p>
      </div>

      <div className="card space-y-4 p-0 sm:p-0">
        <div role="tablist" className="grid grid-cols-2 border-b border-border text-sm">
          {(Object.keys(THREADS) as ChatThread[]).map((t) => {
            const unread = t !== active && count(t) > seen[t];
            return (
              <button
                key={t}
                role="tab"
                type="button"
                aria-selected={t === active}
                onClick={() => open(t)}
                className={`relative cursor-pointer px-4 py-3 font-medium transition ${
                  t === active ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {THREADS[t].tab}
                {unread && (
                  <span className="ml-1.5 inline-block size-2 rounded-full bg-accent align-middle" aria-label="mensajes nuevos" />
                )}
                {t === active && <span className="absolute inset-x-4 -bottom-px h-0.5 rounded bg-foreground" />}
              </button>
            );
          })}
        </div>

        <Thread
          key={active}
          token={token}
          thread={active}
          messages={data[THREADS[active].key]}
          onSent={load}
        />
      </div>
    </section>
  );
}

function Thread({
  token,
  thread,
  messages,
  onSent,
}: {
  token: string;
  thread: ChatThread;
  messages: ChatMessage[] | null;
  onSent: () => Promise<void>;
}) {
  const info = THREADS[thread];
  const listRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const isClient = useIsClient();

  const length = messages?.length ?? 0;
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [length]);

  if (!messages) {
    return <p className="px-5 pb-6 text-sm text-muted sm:px-6">Esta conversación no está disponible.</p>;
  }

  function submit() {
    const body = draft.trim();
    if (!body || pending) return;
    setError(null);
    startTransition(async () => {
      const res = await sendMessage(token, thread, body);
      if (res.error) {
        setError(res.error);
        return;
      }
      setDraft("");
      await onSent();
    });
  }

  return (
    <div className="space-y-3 px-5 pb-5 sm:px-6 sm:pb-6">
      <p className="text-xs text-muted">{info.hint}</p>

      <div
        ref={listRef}
        className="flex h-72 flex-col gap-2 overflow-y-auto rounded-xl bg-background p-3"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <p className="m-auto max-w-xs text-center text-sm text-muted">{info.empty}</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex max-w-[85%] flex-col ${m.mine ? "items-end self-end" : "items-start self-start"}`}>
              <span className="mb-0.5 px-1 text-[11px] text-muted">
                {m.mine ? "Tú" : info.them}
                {isClient && ` · ${timeFormat.format(m.at)}`}
              </span>
              <p
                className={`rounded-2xl px-3.5 py-2 text-sm break-words whitespace-pre-wrap ${
                  m.mine ? "rounded-br-md bg-foreground text-background" : "rounded-bl-md border border-border bg-surface"
                }`}
              >
                {m.body}
              </p>
            </div>
          ))
        )}
      </div>

      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label htmlFor={`chat-${thread}`} className="sr-only">
          Mensaje
        </label>
        <textarea
          id={`chat-${thread}`}
          rows={1}
          maxLength={MAX_LENGTH}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={info.placeholder}
          className="input max-h-32 min-h-10 resize-none"
        />
        <button type="submit" disabled={pending || !draft.trim()} className="btn-primary shrink-0">
          {pending ? "…" : "Enviar"}
        </button>
      </form>
      {error && (
        <p role="alert" className="text-sm text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
