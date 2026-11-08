export default function Loading() {
  return (
    <div className="animate-pulse space-y-6" aria-busy>
      <div className="h-3 w-32 rounded bg-border" />
      <div className="h-9 w-2/3 rounded bg-border" />
      <div className="h-40 rounded-2xl bg-border/60" />
    </div>
  );
}
