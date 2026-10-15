"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Accessible accordion. Answers stay in the DOM (good for search engines); closed panels collapse
 * to zero height (CSS grid-rows transition) and are inert, so they can't be focused or read out.
 */
export function FaqAccordion({ items }: { items: readonly { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
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
                  <span
                    className={cn(
                      "absolute h-3.5 w-[1.5px] rounded-full bg-ink transition-[rotate,opacity] duration-500 ease-out",
                      isOpen && "rotate-90 opacity-0",
                    )}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-[62ch] pb-7 text-lead text-muted">{item.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
