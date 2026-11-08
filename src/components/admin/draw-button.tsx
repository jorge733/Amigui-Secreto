"use client";

import { useActionState } from "react";
import { runDraw, type ActionState } from "@/app/actions";
import { MIN_PARTICIPANTS } from "@/lib/draw";
import { FormMessage } from "../form-message";

export function DrawButton({ adminToken, count }: { adminToken: string; count: number }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    () => runDraw(adminToken),
    {},
  );
  const missing = MIN_PARTICIPANTS - count;

  return (
    <form
      action={action}
      className="space-y-3"
      onSubmit={(e) => {
        if (!window.confirm("¿Hacer el sorteo ahora? Después no podrás editar la lista sin deshacerlo.")) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" disabled={pending || missing > 0} className="btn-primary w-full py-3 text-base">
        {pending ? "Sorteando…" : "Hacer el sorteo"}
      </button>
      {missing > 0 && (
        <p className="text-center text-sm text-muted">
          {missing === 1 ? "Falta 1 participante" : `Faltan ${missing} participantes`} para poder sortear.
        </p>
      )}
      <FormMessage state={state} />
    </form>
  );
}
