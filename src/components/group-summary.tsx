import type { Group } from "@/db/schema";
import { formatEventDate } from "@/lib/format";

export function GroupSummary({ group }: { group: Group }) {
  const date = formatEventDate(group.eventDate);
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{group.name}</h1>
      {(date || group.budget) && (
        <dl className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {date && (
            <div className="flex gap-1.5">
              <dt className="text-muted">Fecha</dt>
              <dd className="first-letter:uppercase">{date}</dd>
            </div>
          )}
          {group.budget && (
            <div className="flex gap-1.5">
              <dt className="text-muted">Presupuesto</dt>
              <dd>{group.budget}</dd>
            </div>
          )}
        </dl>
      )}
      {group.message && <p className="whitespace-pre-line text-muted">{group.message}</p>}
    </div>
  );
}
