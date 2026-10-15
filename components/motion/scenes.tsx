"use client";

import { useRef } from "react";
import { gsap, MQ_DESKTOP_MOTION, MQ_MOTION, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { scheduleMotion } from "@/lib/motion/scheduler";

/**
 * Shared scroll-scene hook (gsap-skills rules): useGSAP scopes and cleans up everything,
 * gsap.matchMedia() gates breakpoints and prefers-reduced-motion, and the setup itself
 * runs in idle time, in page order, through the motion scheduler.
 */
function useScrollScene<T extends HTMLElement>(
  setup: (root: T) => void | (() => void),
  { order = 50, media = MQ_MOTION }: { order?: number; media?: string } = {},
) {
  const ref = useRef<T>(null);
  useGSAP(
    (_context, contextSafe) => {
      const mm = gsap.matchMedia();
      const run = contextSafe!(() => {
        const root = ref.current;
        if (!root || !root.isConnected) return;
        mm.add(media, () => setup(root));
      });
      scheduleMotion(order, run);
      return () => mm.revert();
    },
    { scope: ref },
  );
  return ref;
}

/* ───────── Headlines: masked line reveal (SplitText) ───────── */

export function SplitHeading({
  as: Tag = "h2",
  id,
  className,
  order = 50,
  children,
}: {
  as?: "h2" | "h3" | "p";
  id?: string;
  className?: string;
  order?: number;
  children: React.ReactNode;
}) {
  const ref = useScrollScene<HTMLHeadingElement>(
    (el) => {
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
    { order },
  );
  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}

/* ───────── Gentle vertical parallax for images ───────── */

export function Parallax({
  className,
  amount = 7,
  order = 40,
  children,
}: {
  className?: string;
  amount?: number;
  order?: number;
  children: React.ReactNode;
}) {
  const ref = useScrollScene<HTMLDivElement>(
    (el) => {
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
    { order, media: MQ_DESKTOP_MOTION },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ───────── Hero: scrubbed parallax + pause idle chip motion offscreen ───────── */

export function HeroMotion({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollScene<HTMLDivElement>(
    (root) => {
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
    { order: 0 },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ───────── Statement: words come into focus as you scroll ───────── */

export function StatementScrub({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollScene<HTMLDivElement>(
    (root) => {
      const heading = root.querySelector("h2");
      if (!heading) return;
      const split = SplitText.create(heading, { type: "words", wordsClass: "statement-word" });
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: { trigger: heading, start: "top 82%", end: "bottom 48%", scrub: 0.6 },
        },
      );
    },
    { order: 10 },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ───────── Process: the line draws and each node comes into focus ───────── */

export function ProcessLine({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollScene<HTMLDivElement>(
    (root) => {
      const fill = root.querySelector<HTMLElement>("[data-process-fill]");
      const nodes = root.querySelectorAll<HTMLElement>("[data-node]");
      const layout = gsap.matchMedia();
      layout.add({ desktop: "(min-width: 1024px)", mobile: "(max-width: 1023.98px)" }, (context) => {
        const desktop = Boolean(context.conditions?.desktop);
        gsap.fromTo(
          fill,
          desktop ? { scaleX: 0, scaleY: 1 } : { scaleY: 0, scaleX: 1 },
          {
            scaleX: 1,
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: desktop ? "top 70%" : "top 75%",
              end: desktop ? "bottom 65%" : "bottom 60%",
              scrub: 0.5,
            },
          },
        );
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
    { order: 70 },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ───────── Report: scan line, rows print, checks draw, highlighter wipes ───────── */

export function ReportPrint({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollScene<HTMLDivElement>(
    (root) => {
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
        .fromTo(
          root.querySelector("[data-highlight]"),
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, ease: "power2.inOut" },
          1.55,
        );
    },
    { order: 80 },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ───────── Final CTA: aperture rings open as the plate scrolls in ───────── */

export function CtaRings({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollScene<HTMLDivElement>(
    (root) => {
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
    { order: 120 },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
