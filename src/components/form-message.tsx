import type { ActionState } from "@/app/actions";

export function FormMessage({ state, success }: { state: ActionState; success?: string }) {
  if (state.error) {
    return (
      <p role="alert" className="text-sm text-accent">
        {state.error}
      </p>
    );
  }
  if (state.ok && success) {
    return (
      <p role="status" className="text-sm text-muted">
        {success}
      </p>
    );
  }
  return null;
}
