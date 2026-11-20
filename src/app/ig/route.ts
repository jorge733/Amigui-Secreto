import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/** Navegadores internos de Instagram, Facebook y Threads. */
const IN_APP = /Instagram|FBAN|FBAV|FB_IAB|Barcelona/i;

/**
 * Enlace para la bio de Instagram: si se abre dentro de la app de Instagram,
 * intenta abrir el juego en Chrome; en cualquier otro navegador va directo.
 */
export function GET(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  const target = new URL("/", req.nextUrl);

  if (!IN_APP.test(ua)) return Response.redirect(target, 307);

  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const hostPath = `${target.host}${target.pathname}${target.search}`;

  // Android: un intent que lanza Chrome (o el navegador por defecto si no hay Chrome).
  // iOS: el esquema de Chrome; si no está instalado, no hace nada y queda el aviso.
  const chromeUrl = isAndroid
    ? `intent://${hostPath}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(target.href)};end`
    : isIOS
      ? `googlechromes://${hostPath}`
      : target.href;

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Amigui Secreto</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;background:#fff7f5;color:#1f1f1f;text-align:center;padding:24px;box-sizing:border-box}
  main{max-width:360px}
  h1{font-size:1.4rem;margin:0 0 .5rem}
  p{color:#555;line-height:1.5}
  a.btn{display:block;margin:20px 0 12px;padding:14px 18px;border-radius:12px;background:#e5484d;color:#fff;font-weight:600;text-decoration:none}
  a.alt{color:#555;font-size:.9rem}
</style>
</head>
<body>
<main>
  <h1>🎁 Amigui Secreto</h1>
  <p>Para jugar mejor, ábrelo en Chrome.</p>
  <a class="btn" href="${escapeHtml(chromeUrl)}">Abrir en Chrome</a>
  <p>¿No se abre? Toca <b>⋯</b> arriba a la derecha y elige <b>Abrir en navegador externo</b>.</p>
  <a class="alt" href="${escapeHtml(target.href)}">Seguir aquí</a>
</main>
<script>location.href=${JSON.stringify(chromeUrl).replace(/</g, "\\u003c")};</script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
