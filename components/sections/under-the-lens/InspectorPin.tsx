"use client";

import { gsap, MQ_DESKTOP_MOTION, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { refreshScroll, scheduleMotion } from "@/lib/motion/scheduler";

export type InspectorEngine = { t: number; f: number; active: number; mode: "interactive" | "pinned" };
export type PinApi = { scrollYFor: (index: number) => number };

/**
 * Desktop driver for "Under the lens" (loaded on demand): pins the section and scrubs the loupe
 * from checkpoint to checkpoint with the scroll, then opens into full focus. The page's only pin.
 */
export function InspectorPin({
  sectionRef,
  pinRef,
  engine,
  count,
  render,
  onPinned,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  pinRef: React.RefObject<HTMLDivElement | null>;
  engine: React.RefObject<InspectorEngine>;
  count: number;
  render: () => void;
  onPinned: (api: PinApi | null) => void;
}) {
  useGSAP(
    (_context, contextSafe) => {
      const mm = gsap.matchMedia();
      const setup = contextSafe!(() => {
        mm.add(MQ_DESKTOP_MOTION, () => {
          const section = sectionRef.current;
          const pin = pinRef.current;
          const state = engine.current;
          if (!section || !pin || !state) return;
          state.mode = "pinned";
          const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, onUpdate: render });
          tl.set(state, { t: 0, f: 0 }).addLabel("cp0").to({}, { duration: 0.4 });
          for (let i = 1; i < count; i++) {
            tl.to(state, { t: i, duration: 1 }).addLabel(`cp${i}`).to({}, { duration: 0.45 });
          }
          tl.to(state, { f: 1, duration: 1.1 }).to({}, { duration: 0.5 });
          const st = ScrollTrigger.create({
            animation: tl,
            trigger: section,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 3.4)}`,
            pin,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          });
          onPinned({
            scrollYFor: (index) => st.start + (st.end - st.start) * ((tl.labels[`cp${index}`] ?? 0) / tl.duration()),
          });
          return () => {
            onPinned(null);
            state.mode = "interactive";
            state.t = 0;
            state.f = 0;
            render();
          };
        });
        refreshScroll();
      });
      scheduleMotion(60, setup);
      return () => mm.revert();
    },
    { scope: sectionRef },
  );
  return null;
}
