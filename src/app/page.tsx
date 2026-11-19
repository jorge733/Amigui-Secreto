import { CreateGroupForm } from "@/components/create-group-form";
import { ChatIcon, EyeOffIcon, GiftIcon, HeartIcon, LockIcon, ShuffleIcon, UsersIcon } from "@/components/icons";

const steps = [
  { icon: GiftIcon, title: "Crea el grupo", text: "Ponle nombre, fecha y presupuesto." },
  { icon: UsersIcon, title: "Agrega participantes", text: "Y, si quieres, quién no puede regalarle a quién." },
  { icon: ShuffleIcon, title: "Sortea y comparte", text: "Cada persona recibe un enlace privado con su amigo secreto." },
];

const perks = [
  { icon: EyeOffIcon, text: "Sorteo 100% secreto" },
  { icon: LockIcon, text: "Sin cuentas ni contraseñas" },
  { icon: HeartIcon, text: "Listas de deseos" },
  { icon: ChatIcon, text: "Chat anónimo" },
];

export default function Home() {
  return (
    <div className="space-y-14">
      <section className="relative space-y-5">
        <Ornaments />
        <p className="eyebrow">Amigo secreto online</p>
        <h1 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
          Organiza tu intercambio de regalos, <span className="text-accent italic">sin papelitos.</span>
        </h1>
        <p className="max-w-lg text-lg text-muted text-pretty">
          Un sorteo justo y secreto: ni siquiera quien organiza sabe quién le regala a quién.
        </p>
        <ul className="flex flex-wrap gap-2 pt-1">
          {perks.map(({ icon: PerkIcon, text }) => (
            <li key={text} className="chip text-muted">
              <PerkIcon size={15} className="text-accent" />
              {text}
            </li>
          ))}
        </ul>
        <a href="#nuevo-grupo" className="btn-primary px-5 py-3 text-base sm:hidden">
          Empezar ahora
        </a>
      </section>

      <ol className="grid gap-3 sm:grid-cols-3">
        {steps.map(({ icon: StepIcon, title, text }, i) => (
          <li key={title} className="card relative space-y-3 p-5 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <StepIcon size={20} />
              </span>
              <span className="font-display text-3xl font-semibold text-border">{i + 1}</span>
            </div>
            <div className="space-y-1">
              <h2 className="font-semibold">{title}</h2>
              <p className="text-sm text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ol>

      <section id="nuevo-grupo" className="scroll-mt-6 space-y-4">
        <div>
          <h2 className="section-title">Crea tu grupo</h2>
          <p className="text-sm text-muted">Toma menos de un minuto.</p>
        </div>
        <CreateGroupForm />
        <p className="flex gap-2 text-sm text-muted">
          <LockIcon size={16} className="mt-0.5 shrink-0" />
          <span>
            No necesitas crear una cuenta. Al crear el grupo recibirás un enlace de organizador: guárdalo bien.
          </span>
        </p>
      </section>
    </div>
  );
}

/** Decoración festiva detrás del título. */
function Ornaments() {
  return (
    <div className="pointer-events-none absolute -top-4 right-0 hidden select-none sm:block" aria-hidden>
      <div className="relative size-32">
        <span className="absolute top-0 right-6 text-5xl motion-safe:animate-wiggle">🎁</span>
        <span className="absolute top-16 right-0 text-3xl opacity-80">✨</span>
        <span className="absolute top-20 right-20 text-2xl opacity-70">🎄</span>
      </div>
    </div>
  );
}
