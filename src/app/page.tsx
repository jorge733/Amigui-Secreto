import { CreateGroupForm } from "@/components/create-group-form";

const steps = [
  { title: "Crea el grupo", text: "Ponle nombre, fecha y presupuesto." },
  { title: "Agrega participantes", text: "Y, si quieres, quién no puede regalarle a quién." },
  { title: "Sortea y comparte", text: "Cada persona recibe un enlace privado con su amigo secreto." },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <p className="eyebrow">Amigo secreto</p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Organiza tu intercambio de regalos, sin papelitos.
        </h1>
        <p className="max-w-lg text-lg text-muted text-pretty">
          Un sorteo justo y secreto: ni siquiera quien organiza sabe quién le regala a quién.
        </p>
      </section>

      <ol className="grid gap-6 sm:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title} className="space-y-1">
            <span className="font-mono text-xs text-muted">0{i + 1}</span>
            <h2 className="font-medium">{step.title}</h2>
            <p className="text-sm text-muted">{step.text}</p>
          </li>
        ))}
      </ol>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Nuevo grupo</h2>
        <CreateGroupForm />
        <p className="text-sm text-muted">
          No necesitas crear una cuenta. Al crear el grupo recibirás un enlace de organizador: guárdalo bien.
        </p>
      </section>
    </div>
  );
}
