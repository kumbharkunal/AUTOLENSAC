import { ScrollTrigger } from "@/lib/gsap";

/**
 * Runs scroll-animation setups in idle time, in page order, so hydration stays cheap
 * (lower Total Blocking Time) and ScrollTriggers refresh top-to-bottom. After each
 * batch, triggers are sorted by position and refreshed so pin spacing is always correct.
 */
type Task = { order: number; run: () => void };

const queue: Task[] = [];
let pending = false;

type IdleDeadlineLike = { timeRemaining: () => number };
const requestIdle: (cb: (deadline: IdleDeadlineLike) => void) => void =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? (cb) => window.requestIdleCallback(cb, { timeout: 700 })
    : (cb) => window.setTimeout(() => cb({ timeRemaining: () => 12 }), 32);

let refreshTimer: number | undefined;
export function refreshScroll() {
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  }, 60);
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
