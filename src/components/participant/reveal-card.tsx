"use client";

import { useState } from "react";
import { markRevealed } from "@/app/actions";
import { Avatar } from "../avatar";
import { EyeOffIcon, HeartIcon } from "../icons";

const CONFETTI = ["🎉", "✨", "🎊", "⭐", "🎁", "✨", "🎉", "⭐"];

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
        className="group relative flex w-full cursor-pointer flex-col items-center gap-3 overflow-hidden rounded-3xl bg-accent px-6 py-14 text-center text-accent-contrast shadow-xl shadow-accent/25 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-accent/30 active:translate-y-0"
      >
        {/* Cinta del envoltorio */}
        <span className="absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 bg-gold/80" aria-hidden />
        <span className="absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 bg-gold/80" aria-hidden />
        <span className="relative rounded-2xl bg-surface px-6 py-5 text-foreground shadow-lg">
          <span className="block text-5xl transition group-hover:scale-110 motion-safe:animate-wiggle" aria-hidden>
            🎁
          </span>
          <span className="mt-3 block font-display text-lg font-semibold">Toca para descubrir</span>
          <span className="block text-sm text-muted">a quién le regalas</span>
        </span>
        <span className="relative mt-2 inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1 text-xs font-medium">
          <EyeOffIcon size={14} />
          Que nadie esté mirando tu pantalla
        </span>
      </button>
    );
  }

  return (
    <div className="card relative space-y-6 overflow-hidden py-10 text-center">
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-around" aria-hidden>
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="animate-pop-in text-xl"
            style={{ animationDelay: `${i * 60}ms`, marginTop: `${(i % 3) * 10 + 8}px` }}
          >
            {c}
          </span>
        ))}
      </div>
      <div className="flex animate-pop-in flex-col items-center gap-3 pt-4">
        <Avatar name={receiverName} size="lg" />
        <p className="eyebrow">Tu amigo secreto es</p>
        <p className="font-display text-5xl font-semibold tracking-tight text-balance sm:text-6xl">{receiverName}</p>
      </div>
      <div className="mx-auto max-w-md animate-fade-up rounded-2xl bg-background p-5 text-left [animation-delay:300ms]">
        <p className="label inline-flex items-center gap-1.5">
          <HeartIcon size={15} className="text-accent" />
          Su lista de deseos
        </p>
        {receiverWishlist ? (
          <p className="whitespace-pre-line">{receiverWishlist}</p>
        ) : (
          <p className="text-sm text-muted">
            Todavía no ha escrito nada. Vuelve a revisar más adelante o pregúntale por el chat anónimo.
          </p>
        )}
      </div>
      <button type="button" onClick={() => setShown(false)} className="btn-ghost text-xs">
        <EyeOffIcon size={14} />
        Ocultar
      </button>
    </div>
  );
}
