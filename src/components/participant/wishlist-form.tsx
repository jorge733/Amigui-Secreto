"use client";

import { useActionState, useState } from "react";
import { saveWishlist, type ActionState } from "@/app/actions";
import { FormMessage } from "../form-message";
import { HeartIcon } from "../icons";

const MAX_LENGTH = 1000;

export function WishlistForm({ token, wishlist }: { token: string; wishlist: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    saveWishlist.bind(null, token),
    {},
  );
  const [length, setLength] = useState(wishlist.length);

  return (
    <form action={action} className="card space-y-4">
      <div className="flex gap-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <HeartIcon size={20} />
        </span>
        <div>
          <label htmlFor="wishlist" className="section-title block">
            Tu lista de deseos
          </label>
          <p className="text-sm text-muted">Ayuda a quien te regala: ideas, tallas, colores o cosas que no te gustan.</p>
        </div>
      </div>
      <div className="relative">
        <textarea
          id="wishlist"
          name="wishlist"
          rows={5}
          maxLength={MAX_LENGTH}
          defaultValue={wishlist}
          onChange={(e) => setLength(e.target.value.length)}
          placeholder={"Un libro de misterio\nTalla M\nNada de chocolate 🙏"}
          className="input resize-y pb-7"
        />
        <span className="pointer-events-none absolute right-3 bottom-2.5 text-xs text-muted tabular-nums">
          {length}/{MAX_LENGTH}
        </span>
      </div>
      <div className="flex items-center justify-end gap-3">
        <FormMessage state={state} success="Guardado" />
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
