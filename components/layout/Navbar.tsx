"use client";

import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { InstagramIcon, WhatsAppIcon } from "@/components/brand/SocialIcons";
import { ButtonLink } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { getLenis, scrollToTarget, subscribeLenis } from "@/lib/motion/lenis-store";

type NavLink = { label: string; href: string };

const spring = { type: "spring", stiffness: 380, damping: 34, mass: 0.9 } as const;

export function Navbar({
  links,
  logo,
  book,
  call,
  instagram,
}: {
  links: readonly NavLink[];
  logo: React.ReactNode;
  book: { href: string; label: string };
  call: { href: string; label: string };
  instagram: { href: string; label: string };
}) {
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const lastY = useRef(0);
  const wasOpen = useRef(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const reduce = useReducedMotion();
  const lenis = useSyncExternalStore(subscribeLenis, getLenis, () => null);
  const { scrollY } = useScroll();
  const transition = reduce ? { duration: 0 } : spring;

  // Hide on scroll down, show on scroll up, shrink after the hero.
  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - lastY.current;
    lastY.current = y;
    const nextCompact = y > window.innerHeight * 0.75;
    if (nextCompact !== compact) setCompact(nextCompact);
    if (open) return;
    if (y < 140) {
      if (hidden) setHidden(false);
    } else if (delta > 6 && !hidden) {
      setHidden(true);
    } else if (delta < -6 && hidden) {
      setHidden(false);
    }
  });

  // Which section is in the middle of the viewport.
  useEffect(() => {
    const targets = ["top", ...links.map((link) => link.href.slice(1))]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id === "top" ? null : entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [links]);

  // Slide the indicator under the active link (DOM writes only).
  useEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    const place = () => {
      const link = active ? list.querySelector<HTMLElement>(`[data-nav-link="${active}"]`) : null;
      if (!link) {
        indicator.style.opacity = "0";
        return;
      }
      indicator.style.opacity = "1";
      indicator.style.width = `${link.offsetWidth}px`;
      indicator.style.transform = `translate3d(${link.offsetLeft}px, -50%, 0)`;
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => ro.disconnect();
  }, [active]);

  // Mobile menu: lock scroll, contain focus, restore on close.
  useEffect(() => {
    const root = document.documentElement;
    const inertTargets = document.querySelectorAll<HTMLElement>("[data-menu-inert]");
    if (open) {
      wasOpen.current = true;
      lenis?.stop();
      root.style.overflow = "hidden";
      root.setAttribute("data-menu-open", "");
      inertTargets.forEach((el) => el.setAttribute("inert", ""));
      const frame = requestAnimationFrame(() => firstLinkRef.current?.focus({ preventScroll: true }));
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("keydown", onKey);
      };
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      lenis?.start();
      root.style.overflow = "";
      root.removeAttribute("data-menu-open");
      inertTargets.forEach((el) => el.removeAttribute("inert"));
      toggleRef.current?.focus({ preventScroll: true });
    }
  }, [open, lenis]);

  // Close the sheet if the viewport grows to desktop.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const goTo = (href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setOpen(false);
    window.history.pushState(null, "", href);
    // Wait for the scroll lock to lift, then glide to the section.
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToTarget(href)));
  };

  return (
    <>
      <m.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
        initial={false}
        animate={{ y: hidden && !open ? "-130%" : "0%" }}
        transition={transition}
      >
        <m.div
          className="glass pointer-events-auto flex h-14 w-full max-w-[960px] items-center justify-between gap-4 rounded-full pr-1.5 pl-5 lg:h-[60px] lg:pr-2 lg:pl-6"
          initial={false}
          animate={{ scale: compact && !open ? 0.97 : 1 }}
          transition={transition}
        >
          <a href="#top" className="-m-2 flex items-center rounded-full p-2 text-[23px] lg:text-[24px]" aria-label="AutoLens, back to top">
            {logo}
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul ref={listRef} className="relative flex items-center">
              <span
                ref={indicatorRef}
                aria-hidden="true"
                className="absolute top-1/2 left-0 h-9 rounded-full bg-ink/[0.06] opacity-0 transition-[transform,width,opacity] duration-500 ease-out"
                style={{ transform: "translate3d(0, -50%, 0)" }}
              />
              {links.map((link) => {
                const id = link.href.slice(1);
                const isActive = active === id;
                return (
                  <li key={link.href} className="relative">
                    <a
                      href={link.href}
                      data-nav-link={id}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "relative block rounded-full px-3.5 py-2 text-[14.5px] transition-colors duration-300",
                        isActive ? "text-ink" : "text-ink/70 hover:text-ink",
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <span className="hidden lg:block">
              <ButtonLink href={book.href} badge="whatsapp" size="sm" external>
                {book.label}
              </ButtonLink>
            </span>

            <a
              href={book.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${book.label} on WhatsApp`}
              className="grid h-11 w-11 place-items-center rounded-full lg:hidden"
            >
              <WhatsAppIcon tone="badge" className="h-9 w-9" />
            </a>

            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
              className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-ink/[0.05] lg:hidden"
            >
              <span className="relative block h-3 w-5" aria-hidden="true">
                <m.span
                  className="absolute top-0 left-0 h-[1.5px] w-5 rounded-full bg-ink"
                  initial={false}
                  animate={open ? { y: 5.25, rotate: 45 } : { y: 0, rotate: 0 }}
                  transition={transition}
                />
                <m.span
                  className="absolute bottom-0 left-0 h-[1.5px] w-5 rounded-full bg-ink"
                  initial={false}
                  animate={open ? { y: -5.25, rotate: -45 } : { y: 0, rotate: 0 }}
                  transition={transition}
                />
              </span>
            </button>
          </div>
        </m.div>
      </m.header>

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
            onClick={() => setOpen(false)}
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
                  <m.li
                    key={link.href}
                    variants={{ closed: { opacity: 0, y: 14 }, open: { opacity: 1, y: 0 } }}
                    transition={transition}
                  >
                    <a
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      onClick={goTo(link.href)}
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
    </>
  );
}
