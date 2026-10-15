/**
 * Scroll position published by the motion engine (from ScrollTrigger, which Lenis keeps in sync),
 * so UI like the navbar can react to scroll direction without its own scroll listener.
 */
type Listener = (y: number) => void;
const listeners = new Set<Listener>();

export function publishScroll(y: number) {
  listeners.forEach((listener) => listener(y));
}

export function subscribeScroll(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
