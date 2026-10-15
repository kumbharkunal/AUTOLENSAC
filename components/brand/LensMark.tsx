import { cn } from "@/lib/cn";

type Tone = "brand" | "ink" | "ivory";

const ring: Record<Tone, string> = {
  brand: "var(--color-navy)",
  ink: "currentColor",
  ivory: "var(--color-ivory)",
};
const core: Record<Tone, string> = {
  brand: "var(--color-lens)",
  ink: "currentColor",
  ivory: "var(--color-lens-tint)",
};

/**
 * The magnifier "o" from the AutoLens wordmark. Reused as the site's signature motif
 * (intro, cursor, markers, process nodes, seals, favicon).
 * TODO: replace with paths from the official logo file when the client supplies it.
 */
export function LensMark({
  className,
  tone = "brand",
  title,
}: {
  className?: string;
  tone?: Tone;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d="M31.6 31.6 42 42" stroke={ring[tone]} strokeWidth="5.6" strokeLinecap="round" fill="none" />
      <circle cx="21" cy="21" r="14.2" stroke={ring[tone]} strokeWidth="5.2" fill="none" />
      <circle cx="21" cy="21" r="7.6" fill={core[tone]} />
      <circle cx="18.2" cy="18.2" r="2.1" fill="#fff" fillOpacity={tone === "ink" ? 0 : 0.85} />
    </svg>
  );
}
