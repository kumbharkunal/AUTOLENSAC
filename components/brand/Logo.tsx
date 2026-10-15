import { cn } from "@/lib/cn";
import { LensMark } from "./LensMark";

/**
 * AutoLens wordmark: navy "Aut", the magnifier "o", blue "Lens".
 * A faithful recreation of the logo seen on Instagram, set in the site's grotesk.
 * Size it with font-size (e.g. `text-[26px]`).
 * TODO: replace with official logo file (SVG) when the client supplies it.
 */
export function Logo({
  className,
  subline = false,
  tone = "brand",
}: {
  className?: string;
  subline?: boolean;
  tone?: "brand" | "ivory";
}) {
  const auto = tone === "ivory" ? "text-ivory" : "text-navy";
  const lens = tone === "ivory" ? "text-lens-tint" : "text-lens";
  return (
    <span className={cn("inline-flex flex-col items-start leading-none", className)}>
      <span className="sr-only">AutoLens</span>
      <span aria-hidden="true" className="inline-flex items-baseline font-sans font-semibold tracking-[-0.045em]">
        <span className={auto}>Aut</span>
        <LensMark
          tone={tone === "ivory" ? "ivory" : "brand"}
          className="mx-[0.015em] h-[0.78em] w-[0.78em] translate-y-[0.17em] self-baseline"
        />
        <span className={cn(lens, "-ml-[0.06em]")}>Lens</span>
      </span>
      {subline ? (
        <span
          aria-hidden="true"
          className={cn(
            "mt-[0.42em] flex w-full items-center gap-[0.5em] font-sans text-[0.205em] font-medium tracking-[0.2em] whitespace-nowrap uppercase",
            tone === "ivory" ? "text-ivory/70" : "text-muted",
          )}
        >
          <span className="h-px flex-1 bg-current opacity-50" />
          Pre-Delivery Inspection | Consultation
          <span className="h-px flex-1 bg-current opacity-50" />
        </span>
      ) : null}
    </span>
  );
}
