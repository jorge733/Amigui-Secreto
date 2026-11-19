import type { Group } from "@/db/schema";
import { formatEventDate } from "@/lib/format";
import { Countdown } from "./countdown";
import { CalendarIcon, WalletIcon } from "./icons";

export function GroupSummary({ group }: { group: Group }) {
  const date = formatEventDate(group.eventDate);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
        {group.name}
      </h1>
      {(date || group.budget) && (
        <dl className="flex flex-wrap gap-2">
          {date && (
            <div className="chip">
              <dt>
                <CalendarIcon size={15} className="text-accent" />
                <span className="sr-only">Fecha</span>
              </dt>
              <dd className="first-letter:uppercase">{date}</dd>
            </div>
          )}
          {group.budget && (
            <div className="chip">
              <dt>
                <WalletIcon size={15} className="text-accent" />
                <span className="sr-only">Presupuesto</span>
              </dt>
              <dd>{group.budget}</dd>
            </div>
          )}
          {group.eventDate && <Countdown date={group.eventDate} />}
        </dl>
      )}
      {group.message && (
        <p className="border-l-2 border-accent/40 pl-4 whitespace-pre-line text-muted">{group.message}</p>
      )}
    </div>
  );
}
