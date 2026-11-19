import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card space-y-4 py-14 text-center">
      <p className="text-5xl" aria-hidden>
        🔍
      </p>
      <h1 className="font-display text-3xl font-semibold">Enlace no encontrado</h1>
      <p className="mx-auto max-w-sm text-muted">Revisa que el enlace esté completo, o crea un grupo nuevo.</p>
      <Link href="/" className="btn-primary">
        Ir al inicio
      </Link>
    </div>
  );
}
