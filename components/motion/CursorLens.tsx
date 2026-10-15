"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * A small lens ring that trails the mouse and widens over links and buttons.
 * It never replaces the native cursor and only runs on fine pointers with hover,
 * with motion allowed (toggle with `features.cursor` in content/site.ts).
 */
export function CursorLens() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;

    const ctx = gsap.context(() => {});
    let xTo: (value: number) => void = () => {};
    let yTo: (value: number) => void = () => {};
    ctx.add(() => {
      xTo = gsap.quickTo(el, "x", { duration: 0.32, ease: "power3" });
      yTo = gsap.quickTo(el, "y", { duration: 0.32, ease: "power3" });
    });

    let shown = false;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (!shown) {
        gsap.set(el, { x: event.clientX, y: event.clientY });
        el.setAttribute("data-visible", "");
        shown = true;
      }
      xTo(event.clientX);
      yTo(event.clientY);
    };
    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const interactive = target?.closest("a, button, [role='button'], [data-cursor='interactive']");
      el.dataset.state = interactive ? "interactive" : "default";
    };
    const onLeave = () => {
      el.removeAttribute("data-visible");
      shown = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={ref} className="cursor-lens" aria-hidden="true">
      <div className="cursor-lens__ring" />
    </div>
  );
}
