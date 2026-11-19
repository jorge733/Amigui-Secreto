"use client";

import { useSyncExternalStore } from "react";
import { daysUntil } from "@/lib/format";

const noopSubscribe = () => () => {};

/** Cuenta regresiva hasta el intercambio, calculada con la fecha local del navegador. */
export function Countdown({ date }: { date: string }) {
  const days = useSyncExternalStore(
    noopSubscribe,
    () => daysUntil(date),
    () => null,
  );
  if (days === null || days < 0) return null;

  return (
    <div className="chip animate-fade-up border-transparent bg-gold-soft font-medium text-gold-ink">
      <dt className="sr-only">Cuenta regresiva</dt>
      <dd>{days === 0 ? "¡Es hoy! 🎉" : days === 1 ? "Falta 1 día" : `Faltan ${days} días`}</dd>
    </div>
  );
}
