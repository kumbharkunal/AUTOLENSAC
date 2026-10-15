"use client";

import { PauseIcon, PlayIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState } from "react";
import { LensMark } from "@/components/brand/LensMark";
import { Container } from "@/components/ui/primitives";

/** The page's one marquee: model names as plain text (no maker logos). Pausable (WCAG 2.2.2). */
export function ModelsMarquee({ label, items }: { label: string; items: readonly string[] }) {
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Stop the animation while it is off screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => el.toggleAttribute("data-offscreen", !entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const list = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="marquee__list flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="font-display text-[clamp(2rem,1.4rem+2.6vw,3.75rem)] leading-none font-medium whitespace-nowrap text-ink/85">
            {item}
          </span>
          <LensMark className="mx-7 h-5 w-5 opacity-70 sm:mx-10 sm:h-6 sm:w-6" />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="models-title" className="border-y border-ink/10 py-10 sm:py-12">
      <Container className="mb-8 flex items-center justify-between gap-4">
        <h2 id="models-title" className="text-label text-muted">
          {label}
        </h2>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/15 text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-ink motion-reduce:hidden"
        >
          {paused ? <PlayIcon weight="fill" className="h-4 w-4" /> : <PauseIcon weight="fill" className="h-4 w-4" />}
          <span className="sr-only">{paused ? "Play" : "Pause"} the list of vehicle models</span>
        </button>
      </Container>
      <div
        ref={ref}
        className="marquee overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)]"
        data-paused={paused}
      >
        <div className="marquee__track">
          {list(false)}
          {list(true)}
        </div>
      </div>
    </section>
  );
}
