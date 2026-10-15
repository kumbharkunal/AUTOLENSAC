"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { useRef } from "react";
import { SplitHeading } from "@/components/motion/scenes";
import { Container } from "@/components/ui/primitives";

/** Horizontal scroll-snap rail with previous / next buttons (an alternative to swiping). */
export function Rail({
  title,
  titleId,
  label,
  children,
}: {
  title: string;
  titleId: string;
  label: string;
  children: React.ReactNode;
}) {
  const listRef = useRef<HTMLUListElement>(null);

  const scroll = (direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    const card = list.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : list.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({ left: direction * step, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <>
      <Container className="flex items-end justify-between gap-6">
        <SplitHeading id={titleId} order={95} className="font-display text-h2 font-medium text-ink">
          {title}
        </SplitHeading>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scroll(-1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-ink/[0.05]"
          >
            <CaretLeftIcon weight="regular" className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scroll(1)}
            className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-ink/[0.05]"
          >
            <CaretRightIcon weight="regular" className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </Container>
      <Container className="mt-10 sm:mt-12">
        <ul
          ref={listRef}
          aria-label={label}
          className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 md:-mx-8 md:scroll-px-8 md:px-8 lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {children}
        </ul>
      </Container>
    </>
  );
}
