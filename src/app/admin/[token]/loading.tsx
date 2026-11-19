export default function Loading() {
  return (
    <div className="animate-pulse space-y-6" aria-busy>
      <div className="h-3 w-32 rounded bg-border" />
      <div className="h-11 w-2/3 rounded-lg bg-border" />
      <div className="flex gap-2">
        <div className="h-7 w-44 rounded-full bg-border/70" />
        <div className="h-7 w-24 rounded-full bg-border/70" />
      </div>
      <div className="h-6 rounded bg-border/50" />
      <div className="h-28 rounded-2xl bg-border/60" />
      <div className="h-56 rounded-2xl bg-border/60" />
    </div>
  );
}
