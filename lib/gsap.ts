import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Register once, client side only (gsap-skills: register before any useGSAP or ScrollTrigger call).
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  // Mobile URL-bar show/hide resizes the viewport; don't recalculate every trigger for it.
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "power3.out", duration: 0.9 });
}

/** Desktop + motion allowed. */
export const MQ_DESKTOP_MOTION = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
/**
 * Where "Under the lens" sticks and scrubs: desktop, motion allowed, and tall enough for the whole
 * panel to fit on screen. Must match the `pin-ok:motion-safe:` classes in Inspector.tsx (the
 * `pin-ok` variant is defined in app/globals.css).
 */
export const MQ_PIN = "(min-width: 1024px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)";
/** Any width, motion allowed. */
export const MQ_MOTION = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
