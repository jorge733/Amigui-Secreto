"use client";

import { useActionState } from "react";
import { createGroup, type ActionState } from "@/app/actions";
import { FormMessage } from "./form-message";
import { GroupFields } from "./group-fields";

export function CreateGroupForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createGroup, {});

  return (
    <form action={action} className="card space-y-4">
      <GroupFields />
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className="btn-primary w-full py-2.5">
        {pending ? "Creando…" : "Crear grupo"}
      </button>
    </form>
  );
}
