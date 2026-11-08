import type { Group } from "@/db/schema";

/** Campos compartidos entre crear y editar un grupo. */
export function GroupFields({ group }: { group?: Group }) {
  return (
    <>
      <div>
        <label htmlFor="name" className="label">
          Nombre del grupo
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={80}
          defaultValue={group?.name}
          placeholder="Navidad familia 2026"
          className="input"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="eventDate" className="label">
            Fecha del intercambio <span className="font-normal text-muted">(opcional)</span>
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            defaultValue={group?.eventDate ?? ""}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="budget" className="label">
            Presupuesto <span className="font-normal text-muted">(opcional)</span>
          </label>
          <input
            id="budget"
            name="budget"
            maxLength={60}
            defaultValue={group?.budget ?? ""}
            placeholder="$20.000"
            className="input"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="label">
          Mensaje para los participantes <span className="font-normal text-muted">(opcional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          maxLength={500}
          defaultValue={group?.message ?? ""}
          placeholder="Nos juntamos el 24 en casa de la abuela 🎄"
          className="input resize-y"
        />
      </div>
    </>
  );
}
