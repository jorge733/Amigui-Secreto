"use client";

import { useActionState } from "react";
import { saveWishlist, type ActionState } from "@/app/actions";
import { FormMessage } from "../form-message";

export function WishlistForm({ token, wishlist }: { token: string; wishlist: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    saveWishlist.bind(null, token),
    {},
  );

  return (
    <form action={action} className="card space-y-3">
      <div>
        <label htmlFor="wishlist" className="label">
          Tu lista de deseos
        </label>
        <p className="mb-2 text-sm text-muted">
          Ayuda a quien te regala: ideas, tallas, colores o cosas que no te gustan.
        </p>
        <textarea
          id="wishlist"
          name="wishlist"
          rows={5}
          maxLength={1000}
          defaultValue={wishlist}
          placeholder={"Un libro de misterio\nTalla M\nNada de chocolate 🙏"}
          className="input resize-y"
        />
      </div>
      <div className="flex items-center justify-end gap-3">
        <FormMessage state={state} success="Guardado ✓" />
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
