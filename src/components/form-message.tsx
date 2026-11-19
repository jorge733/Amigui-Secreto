import type { ActionState } from "@/app/actions";
import { CheckIcon } from "./icons";

export function FormMessage({ state, success }: { state: ActionState; success?: string }) {
  if (state.error) {
    return (
      <p role="alert" className="animate-fade-up rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">
        {state.error}
      </p>
    );
  }
  if (state.ok && success) {
    return (
      <p role="status" className="inline-flex animate-fade-up items-center gap-1 text-sm text-pine">
        <CheckIcon size={15} />
        {success}
      </p>
    );
  }
  return null;
}
