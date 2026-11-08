"use client";

import { useFormStatus } from "react-dom";

/** Botón de envío que pide confirmación antes de ejecutar la acción. */
export function ConfirmSubmit({
  message,
  children,
  pendingLabel,
  className = "btn-secondary",
}: {
  message: string;
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
