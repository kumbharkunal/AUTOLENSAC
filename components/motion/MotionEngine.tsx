"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { CursorLens } from "@/components/motion/CursorLens";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/motion/lenis-store";
import { refreshScroll, setScrollRefresher } from "@/lib/motion/scheduler";
import { publishScroll } from "@/lib/motion/scroll-store";

/**
 * Loaded on demand by MotionRoot. Owns the smooth-scroll stack:
 * - Lenis, driven by GSAP's ticker and synced with ScrollTrigger (gsap-skills pattern);
 *   not created under prefers-reduced-motion; native scrolling on touch (syncTouch: false)
 * - publishes the scroll position for the navbar
 * - registers the ScrollTrigger refresher used by the motion scheduler
 */
export function MotionEngine({ cursor }: { cursor: boolean }) {
  useEffect(() => {
    setScrollRefresher(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });

    const scrollReporter = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => publishScroll(self.scroll()),
    });

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lenis = new Lenis({
        autoRaf: false,
        lerp: 0.11,
        smoothWheel: true,
        syncTouch: false,
        anchors: true, // section scroll-margin-top (96px) clears the floating nav
      });
      lenis.on("scroll", ScrollTrigger.update);
      const instance = lenis;
      tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    }

    // Web fonts change line lengths (SplitText, pin heights): refresh once they're ready.
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) refreshScroll();
    });

    return () => {
      cancelled = true;
      scrollReporter.kill();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return cursor ? <CursorLens /> : null;
}
