"use client";

import { AnimatePresence, LazyMotion, domAnimation, m, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { InstagramIcon } from "@/components/brand/SocialIcons";
import { ButtonLink } from "@/components/ui/primitives";

type Link = { label: string; href: string };

const spring = { type: "spring", stiffness: 380, damping: 34, mass: 0.9 } as const;

/**
 * Mobile menu sheet (Motion: AnimatePresence, spring physics, staggered links). Loaded on demand
 * by the navbar; scroll lock, inert background, Esc and focus restore live in Navbar.tsx.
 */
export function MobileMenu({
  open,
  onClose,
  onNavigate,
  links,
  book,
  call,
  instagram,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => void;
  links: readonly Link[];
  book: Link;
  call: Link;
  instagram: Link;
}) {
  const reduce = useReducedMotion();
  const transition = reduce ? { duration: 0 } : spring;
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Move focus into the sheet when it opens.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => firstLinkRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {open ? (
          <m.div
            key="backdrop"
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-navy/25 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.3 }}
            onClick={onClose}
          />
        ) : null}
        {open ? (
          <m.div
            key="panel"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-x-3 top-[76px] z-50 max-h-[calc(100svh-88px)] origin-top overflow-y-auto overscroll-contain rounded-[28px] bg-ivory p-6 shadow-lift sm:inset-x-4 lg:hidden"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985, transition: { duration: reduce ? 0 : 0.18 } }}
            transition={transition}
          >
            <nav aria-label="Mobile">
              <m.ul
                className="flex flex-col"
                initial="closed"
                animate="open"
                variants={{ open: { transition: { staggerChildren: reduce ? 0 : 0.045, delayChildren: reduce ? 0 : 0.05 } } }}
              >
                {links.map((link, index) => (
                  <m.li key={link.href} variants={{ closed: { opacity: 0, y: 14 }, open: { opacity: 1, y: 0 } }} transition={transition}>
                    <a
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      onClick={onNavigate(link.href)}
                      className="flex min-h-12 items-center py-1.5 font-display text-[2.1rem] leading-tight font-medium text-ink"
                    >
                      {link.label}
                    </a>
                  </m.li>
                ))}
              </m.ul>
            </nav>
            <m.div
              className="mt-7 grid gap-3 border-t border-ink/10 pt-7"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : { ...spring, delay: 0.25 }}
            >
              <ButtonLink href={book.href} badge="whatsapp" external fullWidth>
                {book.label}
              </ButtonLink>
              <ButtonLink href={call.href} variant="secondary" badge="phone" fullWidth>
                {call.label}
              </ButtonLink>
              <a
                href={instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 items-center gap-2.5 self-start text-[15px] text-ink/80"
              >
                <InstagramIcon className="h-5 w-5" />
                {instagram.label}
              </a>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}
