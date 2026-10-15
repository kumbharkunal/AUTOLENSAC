import type Lenis from "lenis";

// A tiny external store so any client component can reach the Lenis instance
// (via useSyncExternalStore) without React state updates inside effects.
let instance: Lenis | null = null;
const listeners = new Set<() => void>();

export function setLenis(next: Lenis | null) {
  instance = next;
  listeners.forEach((listener) => listener());
}

export function getLenis() {
  return instance;
}

export function subscribeLenis(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Smooth-scroll to an anchor (or element); CSS scroll-margin-top keeps it clear of the nav. */
export function scrollToTarget(target: string | HTMLElement, opts: { immediate?: boolean } = {}) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (instance) {
    instance.scrollTo(el, { immediate: opts.immediate }); // honours scroll-margin-top
  } else {
    el.scrollIntoView({ behavior: opts.immediate ? "auto" : "smooth", block: "start" });
  }
}
