/** "2026-12-24" → "jueves, 24 de diciembre de 2026" */
export function formatEventDate(date: string | null) {
  if (!date) return null;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

/** Días que faltan para la fecha (negativo si ya pasó), según el calendario local de `now`. */
export function daysUntil(date: string | null, now = new Date()) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Date.parse(`${date}T00:00:00Z`) - today;
  return Number.isNaN(diff) ? null : Math.round(diff / 86_400_000);
}
