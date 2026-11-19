import type { NextRequest } from "next/server";
import { getChat } from "@/lib/chat";

export const dynamic = "force-dynamic";

/** Mensajes del participante (lo consulta el chat cada pocos segundos). */
export async function GET(_req: NextRequest, ctx: RouteContext<"/api/chat/[token]">) {
  const { token } = await ctx.params;
  const chat = await getChat(token);
  if (!chat) return Response.json({ error: "No encontrado" }, { status: 404 });
  return Response.json(chat, {
    headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
  });
}
