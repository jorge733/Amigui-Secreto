"use client";

import { useActionState } from "react";
import { createGroup, type ActionState } from "@/app/actions";
import { FormMessage } from "./form-message";
import { GroupFields } from "./group-fields";
import { SparklesIcon } from "./icons";

export function CreateGroupForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(createGroup, {});

  return (
    <form action={action} className="card space-y-5">
      <GroupFields />
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className="btn-primary w-full py-3 text-base">
        <SparklesIcon size={18} />
        {pending ? "Creando…" : "Crear grupo"}
      </button>
    </form>
  );
}
