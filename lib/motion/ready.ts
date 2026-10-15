import { useSyncExternalStore } from "react";

/**
 * "Motion ready" switch. Smooth scrolling and scroll choreography (Lenis, GSAP, ScrollTrigger,
 * SplitText, Motion's menu) only matter once someone starts to interact, so their code loads
 * after the first input or shortly after the page has loaded. This keeps all of it out of the
 * critical rendering path (faster LCP on phones). Components opt in with `useMotionReady()`.
 */
let ready = false;
const listeners = new Set<() => void>();

export function markMotionReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((listener) => listener());
}

export function isMotionReady() {
  return ready;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useMotionReady() {
  return useSyncExternalStore(subscribe, isMotionReady, () => false);
}
