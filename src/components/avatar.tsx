const PALETTE = [
  "bg-accent-soft text-accent",
  "bg-pine-soft text-pine",
  "bg-gold-soft text-gold-ink",
  "bg-foreground/5 text-foreground",
];

function hash(text: string) {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.codePointAt(0)!) >>> 0;
  return h;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = [...(parts[0] ?? "?")][0];
  const second = parts.length > 1 ? [...parts[parts.length - 1]][0] : "";
  return (first + second).toUpperCase();
}

/** Círculo con iniciales; el color se deriva del nombre para ser estable. */
export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-20 text-2xl",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${sizes[size]} ${
        PALETTE[hash(name) % PALETTE.length]
      }`}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
