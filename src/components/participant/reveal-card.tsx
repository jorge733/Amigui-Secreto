"use client";

import { useState } from "react";
import { markRevealed } from "@/app/actions";

export function RevealCard({
  token,
  receiverName,
  receiverWishlist,
}: {
  token: string;
  receiverName: string;
  receiverWishlist: string;
}) {
  const [shown, setShown] = useState(false);

  if (!shown) {
    return (
      <button
        type="button"
        onClick={() => {
          setShown(true);
          void markRevealed(token);
        }}
        className="card group flex w-full flex-col items-center gap-3 py-12 text-center transition hover:border-foreground/30"
      >
        <span className="text-4xl transition group-hover:scale-110" aria-hidden>
          🎁
        </span>
        <span className="font-medium">Toca para descubrir a quién le regalas</span>
        <span className="text-sm text-muted">Asegúrate de que nadie esté mirando tu pantalla.</span>
      </button>
    );
  }

  return (
    <div className="card space-y-6 py-10 text-center">
      <div className="space-y-2">
        <p className="eyebrow">Tu amigo secreto es</p>
        <p className="text-4xl font-semibold tracking-tight sm:text-5xl">{receiverName}</p>
      </div>
      <div className="mx-auto max-w-md border-t border-border pt-6 text-left">
        <p className="label">Su lista de deseos</p>
        {receiverWishlist ? (
          <p className="whitespace-pre-line text-muted">{receiverWishlist}</p>
        ) : (
          <p className="text-sm text-muted">Todavía no ha escrito nada. Vuelve a revisar más adelante.</p>
        )}
      </div>
      <button type="button" onClick={() => setShown(false)} className="btn-ghost text-xs">
        Ocultar
      </button>
    </div>
  );
}
