"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useMotionReady } from "@/lib/motion/ready";
import type { SceneKind } from "./scene-effects";

/**
 * Scroll-scene wrappers. They render their markup immediately (server-rendered, no motion code)
 * and attach the GSAP scene only once motion is unlocked; the GSAP chunk then loads on demand.
 * The choreography itself lives in ./scene-effects.tsx.
 */
const SceneEffect = dynamic(() => import("./scene-effects").then((mod) => mod.SceneEffect), { ssr: false });

function useScene<T extends HTMLElement>(kind: SceneKind, options: { order?: number; amount?: number } = {}) {
  const ref = useRef<T>(null);
  const ready = useMotionReady();
  const effect = ready ? <SceneEffect kind={kind} target={ref} order={options.order} amount={options.amount} /> : null;
  return { ref, effect };
}

/* Headlines: masked line reveal (SplitText) */
export function SplitHeading({
  as: Tag = "h2",
  id,
  className,
  order,
  children,
}: {
  as?: "h2" | "h3" | "p";
  id?: string;
  className?: string;
  order?: number;
  children: React.ReactNode;
}) {
  const { ref, effect } = useScene<HTMLHeadingElement>("split-heading", { order });
  return (
    <>
      <Tag ref={ref} id={id} className={className}>
        {children}
      </Tag>
      {effect}
    </>
  );
}

/* Gentle vertical parallax for images (desktop only) */
export function Parallax({
  className,
  amount,
  order,
  children,
}: {
  className?: string;
  amount?: number;
  order?: number;
  children: React.ReactNode;
}) {
  const { ref, effect } = useScene<HTMLDivElement>("parallax", { order, amount });
  return (
    <div ref={ref} className={className}>
      {children}
      {effect}
    </div>
  );
}

function SceneBox({ kind, className, children }: { kind: SceneKind; className?: string; children: React.ReactNode }) {
  const { ref, effect } = useScene<HTMLDivElement>(kind);
  return (
    <div ref={ref} className={className}>
      {children}
      {effect}
    </div>
  );
}

/* Hero: scrubbed parallax; idle chip motion pauses offscreen */
export function HeroMotion(props: { children: React.ReactNode; className?: string }) {
  return <SceneBox kind="hero" {...props} />;
}

/* Statement: words come into focus as you scroll */
export function StatementScrub(props: { children: React.ReactNode; className?: string }) {
  return <SceneBox kind="statement" {...props} />;
}

/* Process: the line draws and each node comes into focus */
export function ProcessLine(props: { children: React.ReactNode; className?: string }) {
  return <SceneBox kind="process" {...props} />;
}

/* Report: scan line, rows print, checks draw, highlighter wipes */
export function ReportPrint(props: { children: React.ReactNode; className?: string }) {
  return <SceneBox kind="report" {...props} />;
}

/* Final CTA: aperture rings open as the plate scrolls in */
export function CtaRings(props: { children: React.ReactNode; className?: string }) {
  return <SceneBox kind="rings" {...props} />;
}
