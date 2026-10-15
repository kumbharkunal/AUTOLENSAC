import { ArrowUpRightIcon, PhoneIcon } from "@phosphor-icons/react/dist/ssr";
import { LensMark } from "@/components/brand/LensMark";
import { WhatsAppIcon } from "@/components/brand/SocialIcons";
import { cn } from "@/lib/cn";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1360px] px-4 sm:px-6 md:px-8 lg:px-12", className)}>{children}</div>;
}

/** Small mono label above a headline. Rationed: max one per three sections. */
export function Eyebrow({ className, children, tone = "default" }: { className?: string; children: React.ReactNode; tone?: "default" | "ivory" }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[12px] leading-none font-medium tracking-[0.16em] uppercase",
        tone === "ivory" ? "text-ivory/75" : "text-muted",
        className,
      )}
    >
      <LensMark className="h-3.5 w-3.5" tone={tone === "ivory" ? "ivory" : "brand"} />
      {children}
    </p>
  );
}

type Variant = "primary" | "secondary" | "dark-primary" | "dark-secondary";
type Badge = "whatsapp" | "arrow" | "phone" | null;

const variants: Record<Variant, string> = {
  primary: "bg-lens text-ivory hover:bg-lens-deep shadow-float",
  secondary: "border border-ink/20 text-ink hover:bg-ink/[0.05] hover:border-ink/30",
  "dark-primary": "bg-ivory text-ink hover:bg-white",
  "dark-secondary": "border border-ivory/30 text-ivory hover:bg-ivory/10 focus-visible:outline-ivory",
};

/**
 * Pill link with an optional "button-in-button" trailing badge.
 * Every booking CTA uses the same label ("Book your PDI") and the WhatsApp badge.
 */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  badge = null,
  leading,
  size = "md",
  className,
  external,
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  badge?: Badge;
  leading?: React.ReactNode;
  size?: "md" | "sm";
  className?: string;
  external?: boolean;
  ariaLabel?: string;
}) {
  const hasBadge = badge !== null;
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group/btn relative inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full font-sans font-medium whitespace-nowrap select-none",
        "transition-[background-color,color,border-color,transform,box-shadow] duration-300 ease-out active:scale-[0.98]",
        size === "md" ? "h-[52px] text-[15.5px]" : "h-11 text-[14.5px]",
        hasBadge ? (size === "md" ? "pr-1.5 pl-6" : "pr-1 pl-5") : size === "md" ? "px-6" : "px-5",
        variants[variant],
        className,
      )}
    >
      {leading}
      <span>{children}</span>
      {badge === "whatsapp" ? (
        <WhatsAppIcon
          tone="badge"
          className={cn(
            "transition-transform duration-300 ease-out group-hover/btn:scale-105 group-hover/btn:-rotate-6",
            size === "md" ? "ml-1.5 h-10 w-10" : "ml-1 h-9 w-9",
          )}
        />
      ) : null}
      {badge === "arrow" || badge === "phone" ? (
        <span
          className={cn(
            "ml-1.5 grid place-items-center rounded-full",
            variant === "primary" ? "bg-ivory/15" : variant === "dark-primary" ? "bg-ink/[0.07]" : "bg-current/10",
            size === "md" ? "h-10 w-10" : "h-9 w-9",
          )}
        >
          {badge === "arrow" ? (
            <ArrowUpRightIcon
              weight="regular"
              className="h-4 w-4 transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
            />
          ) : (
            <PhoneIcon weight="regular" className="h-4 w-4" />
          )}
        </span>
      ) : null}
    </a>
  );
}

/** Report / readout status: lens-blue pill with a drawn check. */
export function StatusPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-lens/[0.09] py-1 pr-2.5 pl-2 font-mono text-[11px] leading-none font-medium tracking-[0.12em] text-lens uppercase",
        className,
      )}
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true" focusable="false">
        <path
          data-check
          d="M3.5 8.4 6.6 11.4 12.6 4.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
        />
      </svg>
      {children}
    </span>
  );
}

