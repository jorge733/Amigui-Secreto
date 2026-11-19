"use client";

import { useActionState, useEffect, useRef } from "react";
import { addParticipant, type ActionState } from "@/app/actions";
import { FormMessage } from "../form-message";
import { PlusIcon } from "../icons";

export function AddParticipantForm({ adminToken }: { adminToken: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    addParticipant.bind(null, adminToken),
    {},
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.ok) inputRef.current?.focus();
  }, [state]);

  return (
    <form action={action} className="space-y-2">
      <label htmlFor="participant-name" className="sr-only">
        Nombre del participante
      </label>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          id="participant-name"
          name="name"
          required
          autoComplete="off"
          placeholder="Ana, Pedro, Lucía…"
          aria-describedby="participant-hint"
          className="input"
        />
        <button type="submit" disabled={pending} className="btn-primary shrink-0">
          <PlusIcon size={16} />
          <span className="hidden sm:inline">Agregar</span>
          <span className="sr-only sm:hidden">Agregar</span>
        </button>
      </div>
      <p id="participant-hint" className="text-xs text-muted">
        Puedes agregar varias personas a la vez separándolas con comas.
      </p>
      <FormMessage state={state} />
    </form>
  );
}
