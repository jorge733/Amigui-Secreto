"use client";

import { useActionState } from "react";
import { updateGroup, type ActionState } from "@/app/actions";
import type { Group } from "@/db/schema";
import { FormMessage } from "../form-message";
import { GroupFields } from "../group-fields";

export function EditGroupForm({ adminToken, group }: { adminToken: string; group: Group }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    updateGroup.bind(null, adminToken),
    {},
  );

  return (
    <form action={action} className="space-y-4">
      <GroupFields group={group} />
      <div className="flex items-center justify-end gap-3">
        <FormMessage state={state} success="Guardado" />
        <button type="submit" disabled={pending} className="btn-secondary">
          {pending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
