"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import dynamic from "next/dynamic";
import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { LensMark } from "@/components/brand/LensMark";
import { SplitHeading } from "@/components/motion/scenes";
import { Container, Eyebrow } from "@/components/ui/primitives";
import type { Checkpoint, IconName } from "@/content/site";
import { cn } from "@/lib/cn";
import { getLenis } from "@/lib/motion/lenis-store";
import { useMotionReady } from "@/lib/motion/ready";
import type { InspectorEngine, PinApi } from "./InspectorPin";

// The desktop pinned timeline (GSAP + ScrollTrigger) loads on demand, once motion is unlocked.
const InspectorPin = dynamic(() => import("./InspectorPin").then((mod) => mod.InspectorPin), { ssr: false });

type Kind = {
  id: "car" | "bike";
  label: string;
  imageAlt: string;
  checkpoints: readonly Checkpoint[];
};

type Props = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  status: string;
  ready: string;
  kinds: readonly Kind[];
  images: { car: StaticImageData; bike: StaticImageData };
  /** Icons rendered on the server (keeps the icon library out of the client bundle). */
  icons: Partial<Record<IconName, React.ReactNode>>;
};

const ZOOM = 2.2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const easeInOutCubic = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

/**
 * "Under the lens": a real magnifying loupe travels across the vehicle, checkpoint by checkpoint.
 * One DOM, two drivers:
 * - desktop with motion: a pinned, scrubbed GSAP timeline (InspectorPin, loaded on demand)
 * - mobile, tablet or reduced motion: a swipeable card rail and clickable list/hotspots,
 *   gliding the lens with a tiny requestAnimationFrame tween (no library needed)
 * Everything the loupe does is transform-only; React only renders structure and text.
 */
export function Inspector({ id, eyebrow, title, body, status, ready, kinds, images, icons }: Props) {
  const [kindId, setKindId] = useState<Kind["id"]>("car");
  const kind = kinds.find((k) => k.id === kindId) ?? kinds[0];
  const count = kind.checkpoints.length;

  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const loupeRef = useRef<HTMLDivElement>(null);
  const loupeImgRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const tagTextRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLUListElement>(null);

  // Engine state lives outside React: t = position along the checkpoints, f = final full focus.
  const engine = useRef<InspectorEngine>({ t: 0, f: 0, active: -1, mode: "interactive" });
  const pointsRef = useRef<readonly Checkpoint[]>(kind.checkpoints);
  const pinApiRef = useRef<PinApi | null>(null);
  const tweenRef = useRef<number | null>(null);
  const motionReady = useMotionReady();
  const onPinned = useCallback((api: PinApi | null) => {
    pinApiRef.current = api;
  }, []);

  const applyActive = useCallback((index: number) => {
    const root = sectionRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>("[data-index]").forEach((el) => {
      const i = Number(el.dataset.index);
      el.toggleAttribute("data-active", i === index);
      el.toggleAttribute("data-done", i < index);
      if (el.tagName === "BUTTON" && el.hasAttribute("aria-pressed")) el.setAttribute("aria-pressed", String(i === index));
    });
    const point = pointsRef.current[index];
    if (tagTextRef.current && point) tagTextRef.current.textContent = point.readout;
  }, []);

  const render = useCallback(() => {
    const stage = stageRef.current;
    const loupe = loupeRef.current;
    const img = loupeImgRef.current;
    const tag = tagRef.current;
    if (!stage || !loupe || !img || !tag) return;
    const points = pointsRef.current;
    const n = points.length;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    const L = loupe.offsetWidth;
    const { f } = engine.current;
    const t = clamp(engine.current.t, 0, n - 1);
    const i0 = Math.floor(t);
    const i1 = Math.min(i0 + 1, n - 1);
    const x = lerp(points[i0].x, points[i1].x, t - i0) * W;
    const y = lerp(points[i0].y, points[i1].y, t - i0) * H;

    // Grow the lens until it covers the stage, while the zoom returns to 1:1 (seamless focus).
    const far = Math.max(Math.hypot(x, y), Math.hypot(W - x, y), Math.hypot(x, H - y), Math.hypot(W - x, H - y));
    const scale = lerp(1, (2 * far) / L + 0.04, f);
    const zoom = lerp(ZOOM, 1, f);
    const k = zoom / scale;

    loupe.style.transform = `translate3d(${x - L / 2}px, ${y - L / 2}px, 0) scale(${scale})`;
    loupe.style.setProperty("--ring", String(clamp(1 - f * 1.6, 0, 1)));
    img.style.width = `${W}px`;
    img.style.height = `${H}px`;
    img.style.transform = `translate3d(${L / 2 - k * x}px, ${L / 2 - k * y}px, 0) scale(${k})`;

    const tagW = tag.offsetWidth;
    let tagX = x + L * 0.36;
    if (tagX + tagW > W - 10) tagX = x - L * 0.36 - tagW;
    const tagY = clamp(y - L * 0.62, 8, H - 40);
    tag.style.transform = `translate3d(${clamp(tagX, 8, W - tagW - 8)}px, ${tagY}px, 0)`;
    tag.style.opacity = String(clamp(1 - f * 2.5, 0, 1));

    const active = Math.round(t);
    if (active !== engine.current.active) {
      engine.current.active = active;
      applyActive(active);
    }
    stage.toggleAttribute("data-ready", f > 0.62);
  }, [applyActive]);

  /** Interactive driver: glide the lens to a checkpoint. The last one opens into full focus. */
  const glideTo = useCallback(
    (index: number) => {
      const state = engine.current;
      const to = { t: index, f: index === pointsRef.current.length - 1 ? 1 : 0 };
      if (tweenRef.current !== null) cancelAnimationFrame(tweenRef.current);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        state.t = to.t;
        state.f = to.f;
        render();
        return;
      }
      const from = { t: state.t, f: state.f };
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / 850);
        const e = easeInOutCubic(p);
        state.t = lerp(from.t, to.t, e);
        state.f = lerp(from.f, to.f, e);
        render();
        tweenRef.current = p < 1 ? requestAnimationFrame(step) : null;
      };
      tweenRef.current = requestAnimationFrame(step);
    },
    [render],
  );

  useEffect(
    () => () => {
      if (tweenRef.current !== null) cancelAnimationFrame(tweenRef.current);
    },
    [],
  );

  /** Select a checkpoint from the list, a hotspot or the rail buttons. */
  const select = useCallback(
    (index: number) => {
      const pinned = pinApiRef.current;
      if (engine.current.mode === "pinned" && pinned) {
        const y = pinned.scrollYFor(index);
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(y, { duration: 1.1 });
        else window.scrollTo({ top: y, behavior: "smooth" });
        return;
      }
      const card = railRef.current?.querySelector<HTMLElement>(`[data-index="${index}"]`);
      const rail = railRef.current;
      if (rail && card && rail.offsetParent !== null) {
        rail.scrollTo({ left: card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
      }
      glideTo(index);
    },
    [glideTo],
  );

  // First paint: park the lens on checkpoint 1; keep it placed on resize.
  useEffect(() => {
    render();
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(() => render());
    ro.observe(stage);
    return () => ro.disconnect();
  }, [render]);

  // Switching cars/bikes swaps the checkpoints without rebuilding any animation.
  useEffect(() => {
    pointsRef.current = kind.checkpoints;
    engine.current.active = -1;
    render();
  }, [kind, render]);

  // Mobile rail: the card in the middle drives the lens.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (engine.current.mode !== "interactive" || rail.offsetParent === null) return;
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const index = Number((visible.target as HTMLElement).dataset.index);
          if (index !== Math.round(engine.current.t)) glideTo(index);
        }
      },
      { root: rail, threshold: [0.6, 0.9] },
    );
    rail.querySelectorAll("[data-index]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [glideTo]);

  // Dev helper: /?hotspots prints image coordinates on click, for calibrating real photos.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!new URLSearchParams(window.location.search).has("hotspots")) return;
    const stage = stageRef.current;
    if (!stage) return;
    const badge = document.createElement("div");
    badge.style.cssText =
      "position:absolute;left:8px;bottom:8px;z-index:9;padding:6px 10px;border-radius:8px;background:#121a36;color:#fff;font:12px monospace";
    badge.textContent = "click the photo to read x / y";
    stage.appendChild(badge);
    const onClick = (event: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width).toFixed(3);
      const y = ((event.clientY - rect.top) / rect.height).toFixed(3);
      badge.textContent = `x: ${x}, y: ${y}`;
      console.info(`[hotspots] x: ${x}, y: ${y}`);
    };
    stage.addEventListener("click", onClick);
    return () => {
      stage.removeEventListener("click", onClick);
      badge.remove();
    };
  }, []);

  const onToggleKeys = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const index = kinds.findIndex((k) => k.id === kindId);
    const next = kinds[(index + (event.key === "ArrowRight" ? 1 : kinds.length - 1)) % kinds.length];
    setKindId(next.id);
    (event.currentTarget.querySelector(`[data-kind-id="${next.id}"]`) as HTMLElement | null)?.focus();
  };

  return (
    <section ref={sectionRef} id={id} aria-labelledby="lens-title" className="relative">
      <div ref={pinRef} className="flex flex-col justify-center py-24 sm:py-32 lg:h-[100svh] lg:py-0">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Copy, toggle and checklist */}
          <div className="lg:col-span-5 lg:pt-10">
            <Eyebrow>{eyebrow}</Eyebrow>
            <SplitHeading id="lens-title" order={55} className="mt-5 font-display text-h2 font-medium text-ink">
              {title}
            </SplitHeading>
            <p className="mt-5 max-w-[42ch] text-lead text-muted">{body}</p>

            <div
              role="radiogroup"
              aria-label="Vehicle type"
              onKeyDown={onToggleKeys}
              className="relative mt-7 inline-grid grid-cols-2 rounded-full bg-sand/70 p-1 ring-1 ring-ink/5"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-ivory shadow-soft transition-transform duration-500 ease-out"
                style={{ transform: kindId === kinds[0].id ? "translateX(0)" : "translateX(100%)" }}
              />
              {kinds.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  role="radio"
                  aria-checked={kindId === k.id}
                  tabIndex={kindId === k.id ? 0 : -1}
                  data-kind-id={k.id}
                  onClick={() => setKindId(k.id)}
                  className={cn(
                    "relative z-10 min-h-11 min-w-[7.5rem] rounded-full px-6 text-[15px] font-medium transition-colors duration-300",
                    kindId === k.id ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {k.label}
                </button>
              ))}
            </div>

            <ol className="mt-8 hidden lg:block">
              {kind.checkpoints.map((point, index) => (
                <li key={index}>
                  <button
                    type="button"
                    data-index={index}
                    aria-pressed="false"
                    onClick={() => select(index)}
                    className="lens-item group flex w-full items-start gap-4 rounded-2xl py-2.5 text-left text-ink/55 transition-colors duration-300 hover:text-ink"
                  >
                    <span className="lens-item__mark mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15 transition-colors duration-300">
                      <span className="h-4 w-4">{icons[point.icon]}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[1.45rem] leading-tight font-medium">{point.title}</span>
                      <span className="lens-item__detail">
                        <span className="overflow-hidden">
                          <span className="mt-1.5 flex items-center gap-3 font-mono text-[11.5px] tracking-[0.12em] text-muted uppercase">
                            <span className="truncate">{point.readout}</span>
                            <span aria-hidden="true" className="leader text-ink" />
                            <span className="text-lens">{status}</span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* Stage */}
          <div className="lg:col-span-7">
            <div
              ref={stageRef}
              data-kind={kindId}
              className="relative aspect-[3/2] overflow-hidden rounded-[24px] bg-cream shadow-lift ring-1 ring-ink/5 lg:rounded-[36px]"
            >
              {kinds.map((k) => (
                <Image
                  key={k.id}
                  src={images[k.id]}
                  alt={k.imageAlt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  data-for={k.id}
                  className="lens-photo object-cover"
                  aria-hidden={k.id !== kindId || undefined}
                />
              ))}

              {kind.checkpoints.map((point, index) => (
                <button
                  key={index}
                  type="button"
                  data-index={index}
                  aria-label={`Show ${point.title}`}
                  onClick={() => select(index)}
                  className="lens-hotspot"
                  style={{ left: `${point.x * 100}%`, top: `${point.y * 100}%` }}
                />
              ))}

              <div ref={loupeRef} className="lens-loupe" aria-hidden="true">
                <div ref={loupeImgRef} className="lens-loupe__img">
                  {kinds.map((k) => (
                    <Image
                      key={k.id}
                      src={images[k.id]}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 120vw, 200vw"
                      data-for={k.id}
                      className="lens-photo object-cover"
                    />
                  ))}
                </div>
              </div>

              <div ref={tagRef} className="lens-tag" aria-hidden="true">
                <span className="glass inline-flex items-center gap-2 rounded-full py-1.5 pr-3 pl-2 font-mono text-[10.5px] tracking-[0.12em] whitespace-nowrap text-ink uppercase sm:text-[11px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-lens" />
                  <span ref={tagTextRef}>{kind.checkpoints[0]?.readout}</span>
                </span>
              </div>

              <div className="lens-seal absolute bottom-5 left-1/2 z-[5] sm:bottom-7" aria-hidden="true">
                <span className="glass inline-flex items-center gap-2.5 rounded-full py-2 pr-4 pl-2 text-[14px] font-medium whitespace-nowrap text-ink sm:text-[15px]">
                  <LensMark className="h-7 w-7" />
                  {ready}
                </span>
              </div>
            </div>

            {/* Mobile / tablet rail */}
            <div className="mt-6 lg:hidden">
              <ul
                ref={railRef}
                className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 [&::-webkit-scrollbar]:hidden"
                aria-label={`${kind.label} checklist`}
              >
                {kind.checkpoints.map((point, index) => (
                  <li
                    key={index}
                    data-index={index}
                    className="lens-card w-[82%] shrink-0 snap-center rounded-[22px] border border-ink/10 bg-ivory p-5 transition-[border-color,box-shadow] duration-300 sm:w-[60%] md:w-[46%]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-lens/10 text-lens">
                        <span className="h-5 w-5">{icons[point.icon]}</span>
                      </span>
                      <span className="rounded-full bg-lens/[0.08] px-2.5 py-1 font-mono text-[10.5px] tracking-[0.12em] text-lens uppercase">
                        {status}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-[1.5rem] leading-tight font-medium text-ink">{point.title}</h3>
                    <p className="mt-1.5 font-mono text-[11px] leading-relaxed tracking-[0.12em] text-muted uppercase">
                      {point.readout}
                    </p>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{point.body}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  aria-label="Previous checkpoint"
                  onClick={() => select(Math.max(0, Math.round(engine.current.t) - 1))}
                  className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-ink/[0.05]"
                >
                  <CaretLeftIcon weight="regular" className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next checkpoint"
                  onClick={() => select(Math.min(count - 1, Math.round(engine.current.t) + 1))}
                  className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-ink/[0.05]"
                >
                  <CaretRightIcon weight="regular" className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>
      {motionReady ? (
        <InspectorPin
          sectionRef={sectionRef}
          pinRef={pinRef}
          engine={engine}
          count={count}
          render={render}
          onPinned={onPinned}
        />
      ) : null}
    </section>
  );
}
