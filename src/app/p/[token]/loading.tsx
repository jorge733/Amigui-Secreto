export default function Loading() {
  return (
    <div className="animate-pulse space-y-6" aria-busy>
      <div className="h-3 w-28 rounded bg-border" />
      <div className="h-11 w-2/3 rounded-lg bg-border" />
      <div className="h-72 rounded-3xl bg-border/60" />
    </div>
  );
}
