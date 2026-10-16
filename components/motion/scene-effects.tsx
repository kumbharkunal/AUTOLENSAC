"use client";

import { gsap, MQ_DESKTOP_MOTION, MQ_MOTION, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { scheduleMotion } from "@/lib/motion/scheduler";

/**
 * Scroll choreography, loaded on demand (see components/motion/scenes.tsx).
 * gsap-skills rules: useGSAP scopes and reverts everything, gsap.matchMedia() gates breakpoints
 * and prefers-reduced-motion, ScrollTriggers sit on top-level tweens/timelines only, and every
 * setup runs in idle time, in page order, through the motion scheduler.
 */

export type SceneKind = "split-heading" | "parallax" | "hero" | "statement" | "process" | "report" | "rings";

type Setup = { order: number; media: string; run: (root: HTMLElement, options: { amount?: number }) => void | (() => void) };

const SETUPS: Record<SceneKind, Setup> = {
  /* Headlines: masked line reveal */
  "split-heading": {
    order: 50,
    media: MQ_MOTION,
    run: (el) => {
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 112,
            duration: 1.1,
            stagger: 0.09,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        },
      });
    },
  },

  /* Gentle vertical parallax for images (desktop) */
  parallax: {
    order: 40,
    media: MQ_DESKTOP_MOTION,
    run: (el, { amount = 7 }) => {
      gsap.fromTo(
        el,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
  },

  /* Hero: scrubbed parallax; idle chip motion pauses offscreen */
  hero: {
    order: 0,
    media: MQ_MOTION,
    run: (root) => {
      const io = new IntersectionObserver(([entry]) => {
        root.toggleAttribute("data-hero-offscreen", !entry.isIntersecting);
      });
      io.observe(root);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });
      tl.to(root.querySelector("[data-hero-media]"), { yPercent: 10 }, 0).to(
        root.querySelector("[data-hero-content]"),
        { yPercent: -10 },
        0,
      );
      root.querySelectorAll<HTMLElement>("[data-depth]").forEach((el) => {
        tl.to(el, { y: -Number(el.dataset.depth ?? 40) }, 0);
      });
      return () => io.disconnect();
    },
  },

  /* Statement: words come into focus as you scroll */
  statement: {
    order: 10,
    media: MQ_MOTION,
    run: (root) => {
      const heading = root.querySelector("h2");
      if (!heading) return;
      const split = SplitText.create(heading, { type: "words", wordsClass: "statement-word" });
      // Words sharpen from a soft grey (still AA for large text) to ink; the accent word to lens blue.
      const tokens = getComputedStyle(document.documentElement);
      const read = (name: string, fallback: string) => tokens.getPropertyValue(name).trim() || fallback;
      const isAccent = (el: Element) => Boolean(el.closest(".accent"));
      gsap.fromTo(
        split.words,
        {
          color: (_index: number, el: Element) =>
            isAccent(el) ? read("--statement-dim-accent", "#6f82cf") : read("--statement-dim", "#828596"),
        },
        {
          color: (_index: number, el: Element) =>
            isAccent(el) ? read("--color-lens", "#1a47d1") : read("--color-ink", "#121a36"),
          stagger: 0.12,
          ease: "none",
          scrollTrigger: { trigger: heading, start: "top 82%", end: "bottom 48%", scrub: 0.6 },
        },
      );
    },
  },

  /* Process: the line draws and each node comes into focus */
  process: {
    order: 70,
    media: MQ_MOTION,
    run: (root) => {
      const fill = root.querySelector<HTMLElement>("[data-process-fill]");
      const nodes = root.querySelectorAll<HTMLElement>("[data-node]");
      const layout = gsap.matchMedia();
      layout.add({ desktop: "(min-width: 1024px)", mobile: "(max-width: 1023.98px)" }, (context) => {
        const desktop = Boolean(context.conditions?.desktop);
        gsap.fromTo(fill, desktop ? { scaleX: 0, scaleY: 1 } : { scaleY: 0, scaleX: 1 }, {
          scaleX: 1,
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: desktop ? "top 70%" : "top 75%",
            end: desktop ? "bottom 65%" : "bottom 60%",
            scrub: 0.5,
          },
        });
        nodes.forEach((node) => {
          node.removeAttribute("data-on");
          ScrollTrigger.create({
            trigger: node,
            start: desktop ? "top 70%" : "top 62%",
            onEnter: () => node.setAttribute("data-on", ""),
            onLeaveBack: () => node.removeAttribute("data-on"),
          });
        });
        return () => nodes.forEach((node) => node.setAttribute("data-on", ""));
      });
      return () => layout.revert();
    },
  },

  /* Report: scan line, rows print, checks draw, highlighter wipes */
  report: {
    order: 80,
    media: MQ_MOTION,
    run: (root) => {
      const doc = root.querySelector<HTMLElement>("[data-report-doc]") ?? root;
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: doc, start: "top 72%", once: true },
      });
      tl.fromTo(
        root.querySelector("[data-scan]"),
        { y: 0, opacity: 1 },
        { y: () => doc.offsetHeight, duration: 1.6, ease: "power1.inOut", immediateRender: false },
        0,
      )
        .to(root.querySelector("[data-scan]"), { opacity: 0, duration: 0.3 }, 1.5)
        .from(root.querySelectorAll("[data-row]"), { opacity: 0, y: 14, duration: 0.7, stagger: 0.16 }, 0.2)
        .fromTo(
          root.querySelectorAll("[data-check]"),
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.5, stagger: 0.16, ease: "power2.out" },
          0.55,
        )
        .from(root.querySelectorAll("[data-seal]"), { opacity: 0, scale: 0.85, duration: 0.6, stagger: 0.08 }, 1.2)
        .fromTo(root.querySelector("[data-highlight]"), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 1.55);
    },
  },

  /* Final CTA: aperture rings open as the plate scrolls in */
  rings: {
    order: 120,
    media: MQ_MOTION,
    run: (root) => {
      gsap.fromTo(
        root.querySelectorAll("[data-ring]"),
        { scale: 0.55, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 90%", end: "center 45%", scrub: 0.6 },
        },
      );
    },
  },
};

/** Attaches one scroll scene to `target`. Renders nothing. */
export function SceneEffect({
  kind,
  target,
  order,
  amount,
}: {
  kind: SceneKind;
  target: React.RefObject<HTMLElement | null>;
  order?: number;
  amount?: number;
}) {
  useGSAP(
    (_context, contextSafe) => {
      const setup = SETUPS[kind];
      const mm = gsap.matchMedia();
      let alive = true;
      const run = contextSafe!(() => {
        const root = target.current;
        if (!alive || !root || !root.isConnected) return;
        mm.add(setup.media, () => setup.run(root, { amount }));
      });
      // A setup must never outlive its component, or a scene is built twice (Strict Mode).
      const cancel = scheduleMotion(order ?? setup.order, run);
      return () => {
        alive = false;
        cancel();
        mm.revert();
      };
    },
    { scope: target },
  );
  return null;
}
