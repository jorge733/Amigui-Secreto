"use client";

import { useActionState } from "react";
import { addExclusion, type ActionState } from "@/app/actions";
import { FormMessage } from "../form-message";

type Person = { id: string; name: string };

export function ExclusionForm({ adminToken, people }: { adminToken: string; people: Person[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    addExclusion.bind(null, adminToken),
    {},
  );

  return (
    <form action={action} className="space-y-3">
      <div className="grid items-end gap-2 sm:grid-cols-[1fr_auto_1fr]">
        <div>
          <label htmlFor="giverId" className="label text-muted">
            Quien regala
          </label>
          <select id="giverId" name="giverId" required defaultValue="" className="input">
            <option value="" disabled>
              Elegir…
            </option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <span className="hidden pb-2.5 text-sm text-muted sm:block">no le regala a</span>
        <div>
          <label htmlFor="receiverId" className="label text-muted">
            <span className="sm:hidden">no le regala a</span>
            <span className="hidden sm:inline">Quien recibe</span>
          </label>
          <select id="receiverId" name="receiverId" required defaultValue="" className="input">
            <option value="" disabled>
              Elegir…
            </option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="bothWays" defaultChecked className="size-4 accent-current" />
          En ambos sentidos
        </label>
        <button type="submit" disabled={pending} className="btn-secondary">
          Agregar restricción
        </button>
      </div>
      <FormMessage state={state} />
    </form>
  );
}
