import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GroupSummary } from "@/components/group-summary";
import { RevealCard } from "@/components/participant/reveal-card";
import { WishlistForm } from "@/components/participant/wishlist-form";
import { getParticipantView } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Tu amigo secreto · Amigui Secreto",
  referrer: "no-referrer",
};

// Página privada: siempre se renderiza al momento, nunca desde caché.
export const dynamic = "force-dynamic";

export default async function ParticipantPage({ params }: PageProps<"/p/[token]">) {
  const { token } = await params;
  const view = await getParticipantView(token);
  if (!view) notFound();

  const { me, group, receiver } = view;

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <p className="eyebrow">Hola, {me.name}</p>
        <GroupSummary group={group} />
      </div>

      {group.drawnAt && receiver ? (
        <RevealCard token={token} receiverName={receiver.name} receiverWishlist={receiver.wishlist} />
      ) : (
        <div className="card py-10 text-center">
          <p className="text-3xl" aria-hidden>
            ⏳
          </p>
          <p className="mt-3 font-medium">El sorteo aún no se ha realizado</p>
          <p className="mt-1 text-sm text-muted">
            Guarda este enlace y vuelve cuando quien organiza haga el sorteo.
          </p>
        </div>
      )}

      <WishlistForm token={token} wishlist={me.wishlist} />

      <p className="text-center text-xs text-muted">
        Este enlace es solo para ti. No lo compartas o arruinarás la sorpresa.
      </p>
    </div>
  );
}
