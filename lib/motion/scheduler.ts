/**
 * Runs scroll-animation setups in idle time, in page order, so they never compete with
 * hydration (lower Total Blocking Time) and ScrollTriggers refresh top-to-bottom. After each
 * batch the registered refresher (ScrollTrigger.sort + refresh, set by the motion engine) runs,
 * so pin spacing is always correct. No GSAP import here, to keep this module tiny.
 */
type Task = { order: number; run: () => void };

const queue: Task[] = [];
let pending = false;
let refresher: (() => void) | null = null;

type IdleDeadlineLike = { timeRemaining: () => number };
const requestIdle = (cb: (deadline: IdleDeadlineLike) => void) => {
  if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 700 });
  else globalThis.setTimeout(() => cb({ timeRemaining: () => 12 }), 32);
};

/** Registered once by the motion engine. */
export function setScrollRefresher(fn: () => void) {
  refresher = fn;
}

let refreshTimer: number | undefined;
export function refreshScroll() {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => refresher?.(), 60);
}

function flush(deadline: IdleDeadlineLike) {
  queue.sort((a, b) => a.order - b.order);
  while (queue.length) {
    const task = queue.shift()!;
    try {
      task.run();
    } catch (error) {
      console.error("[motion] setup failed", error);
    }
    if (queue.length && deadline.timeRemaining() < 3) {
      requestIdle(flush);
      return;
    }
  }
  pending = false;
  refreshScroll();
}

/** Queue a setup. Lower `order` runs first (use the section's position on the page). */
export function scheduleMotion(order: number, run: () => void) {
  queue.push({ order, run });
  if (!pending) {
    pending = true;
    requestIdle(flush);
  }
}
