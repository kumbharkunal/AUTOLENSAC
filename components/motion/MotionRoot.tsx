"use client";

import Lenis from "lenis";
import { LazyMotion, domAnimation } from "motion/react";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/motion/lenis-store";
import { refreshScroll } from "@/lib/motion/scheduler";

/**
 * One client root for page-wide motion:
 * - Lenis smooth scrolling, driven by GSAP's ticker and synced with ScrollTrigger
 *   (skipped under prefers-reduced-motion; native scrolling on touch devices)
 * - Motion's LazyMotion (domAnimation features only, `m.*` components)
 * - a single IntersectionObserver for every `[data-reveal]` element
 * - intro skip on first input, ScrollTrigger refresh once web fonts are ready
 */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  // Smooth scroll
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.11,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -84 },
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Scroll reveals: one observer for the whole page
  useEffect(() => {
    const reveal = (el: Element) => el.setAttribute("data-revealed", "");
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach(reveal);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    const observeAll = (root: ParentNode) =>
      root.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((el) => io.observe(el));
    observeAll(document);

    // Code-split sections can mount later; observe them too.
    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches("[data-reveal]")) io.observe(node);
            observeAll(node);
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  // Intro: any input skips it
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("intro-play")) return;
    const skip = () => {
      root.classList.add("intro-skip");
      cleanup();
    };
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    const cleanup = () => events.forEach((type) => window.removeEventListener(type, skip));
    events.forEach((type) => window.addEventListener(type, skip, { passive: true, once: true }));
    const timer = window.setTimeout(cleanup, 1600);
    return () => {
      window.clearTimeout(timer);
      cleanup();
    };
  }, []);

  // Fonts change line lengths (SplitText, pin heights): refresh once they're ready.
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) refreshScroll();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
