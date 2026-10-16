"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { isMotionReady, markMotionReady, useMotionReady } from "@/lib/motion/ready";

// Lenis + GSAP (and the cursor lens) load on demand, once motion is unlocked.
const MotionEngine = dynamic(() => import("./MotionEngine").then((mod) => mod.MotionEngine), { ssr: false });

/**
 * Page-wide motion root, deliberately light:
 * - unlocks the motion stack on the first input, or 2.5s after the page has loaded
 * - one IntersectionObserver for every `[data-reveal]` element (CSS does the animation)
 * - the first-visit intro is skipped by any input
 */
export function MotionRoot({ children, cursor = true }: { children: React.ReactNode; cursor?: boolean }) {
  const ready = useMotionReady();

  // Unlock the motion stack.
  useEffect(() => {
    if (isMotionReady()) return;
    const events = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart", "scroll"] as const;
    let timer = 0;
    const cleanup = () => {
      events.forEach((type) => window.removeEventListener(type, unlock));
      window.removeEventListener("load", onLoad);
      window.clearTimeout(timer);
    };
    const unlock = () => {
      cleanup();
      markMotionReady();
    };
    const onLoad = () => {
      timer = window.setTimeout(unlock, 2500);
    };
    events.forEach((type) => window.addEventListener(type, unlock, { passive: true }));
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return cleanup;
  }, []);

  // Scroll reveals: one observer for the whole page. Content is only held back (html[data-reveals])
  // while this observer runs, so a slow or failed script can never leave a section blank.
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    const reveal = (el: Element) => el.setAttribute("data-revealed", "");
    root.setAttribute("data-reveals", "");
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
      root.removeAttribute("data-reveals");
    };
  }, []);

  // Intro: any input skips it.
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("intro-play")) return;
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    const skip = () => {
      root.classList.add("intro-skip");
      cleanup();
    };
    const cleanup = () => events.forEach((type) => window.removeEventListener(type, skip));
    events.forEach((type) => window.addEventListener(type, skip, { passive: true }));
    const timer = window.setTimeout(cleanup, 1600);
    return () => {
      window.clearTimeout(timer);
      cleanup();
    };
  }, []);

  return (
    <>
      {children}
      {ready ? <MotionEngine cursor={cursor} /> : null}
    </>
  );
}
