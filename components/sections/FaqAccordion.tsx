"use client";

import { m, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

/**
 * Accessible accordion. Answers stay in the DOM (good for search engines); closed panels are
 * collapsed to zero height and made inert so they can't be focused or read out.
 */
export function FaqAccordion({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const baseId = useId();

  return (
    <ul className="divide-y divide-ink/10 border-y border-ink/10">
      {items.map((item, index) => {
        const isOpen = open === index;
        const buttonId = `${baseId}-q-${index}`;
        const panelId = `${baseId}-a-${index}`;
        return (
          <li key={item.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7"
              >
                <span className="font-display text-[1.45rem] leading-snug font-medium text-ink sm:text-[1.7rem]">
                  {item.q}
                </span>
                <span
                  aria-hidden="true"
                  className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ink/15 transition-colors duration-300 group-hover:border-lens/40"
                >
                  <span className="absolute h-[1.5px] w-3.5 rounded-full bg-ink" />
                  <m.span
                    className="absolute h-3.5 w-[1.5px] rounded-full bg-ink"
                    initial={false}
                    animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>
              </button>
            </h3>
            <m.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className="overflow-hidden"
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="max-w-[62ch] pb-7 text-lead text-muted">{item.a}</p>
            </m.div>
          </li>
        );
      })}
    </ul>
  );
}
