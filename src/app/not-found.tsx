import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4 py-12 text-center">
      <p className="text-4xl" aria-hidden>
        🔍
      </p>
      <h1 className="text-2xl font-semibold">Enlace no encontrado</h1>
      <p className="text-muted">Revisa que el enlace esté completo, o crea un grupo nuevo.</p>
      <Link href="/" className="btn-primary">
        Ir al inicio
      </Link>
    </div>
  );
}
