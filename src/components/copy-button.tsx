"use client";

import { useState } from "react";

export function CopyButton({
  text,
  label = "Copiar",
  className = "btn-secondary",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt("Copia este enlace:", text);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button type="button" onClick={copy} className={className}>
      {copied ? "¡Copiado!" : label}
    </button>
  );
}
