"use client";

import { gsap, MQ_PIN, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { refreshScroll, scheduleMotion } from "@/lib/motion/scheduler";

export type InspectorEngine = { t: number; f: number; active: number; mode: "interactive" | "pinned" };
export type PinApi = { scrollYFor: (index: number) => number };

/**
 * Desktop driver for "Under the lens" (loaded on demand). The section's panel is CSS-sticky (see
 * Inspector), so this only scrubs the loupe from checkpoint to checkpoint as the section scrolls
 * by, then opens it into full focus. No pin spacer is inserted, so nothing on the page moves when
 * this loads. Runs where the sticky layout applies (MQ_PIN mirrors the `pin-ok` CSS variant);
 * elsewhere the section scrolls normally and the list drives the lens.
 */
export function InspectorPin({
  sectionRef,
  engine,
  count,
  render,
  onPinned,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  engine: React.RefObject<InspectorEngine>;
  count: number;
  render: () => void;
  onPinned: (api: PinApi | null) => void;
}) {
  useGSAP(
    (_context, contextSafe) => {
      const mm = gsap.matchMedia();
      let alive = true;
      const setup = contextSafe!(() => {
        if (!alive) return;
        mm.add(MQ_PIN, () => {
          const section = sectionRef.current;
          const state = engine.current;
          if (!section || !state) return;
          state.mode = "pinned";
          const tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, onUpdate: render });
          tl.set(state, { t: 0, f: 0 }).addLabel("cp0").to({}, { duration: 0.4 });
          for (let i = 1; i < count; i++) {
            tl.to(state, { t: i, duration: 1 }).addLabel(`cp${i}`).to({}, { duration: 0.45 });
          }
          tl.to(state, { f: 1, duration: 1.1 }).to({}, { duration: 0.5 });
          // From the moment the panel sticks to the moment it lets go.
          const st = ScrollTrigger.create({
            animation: tl,
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
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
      // Never let a queued setup outlive this component (Strict Mode mounts effects twice).
      const cancel = scheduleMotion(60, setup);
      return () => {
        alive = false;
        cancel();
        mm.revert();
      };
    },
    { scope: sectionRef },
  );
  return null;
}
