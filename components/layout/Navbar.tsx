"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { WhatsAppIcon } from "@/components/brand/SocialIcons";
import { ButtonLink } from "@/components/ui/primitives";
import { cn } from "@/lib/cn";
import { getLenis, scrollToTarget, subscribeLenis } from "@/lib/motion/lenis-store";
import { useMotionReady } from "@/lib/motion/ready";
import { subscribeScroll } from "@/lib/motion/scroll-store";

// The Motion-powered sheet loads on demand (first tap or once motion is unlocked).
const MobileMenu = dynamic(() => import("./MobileMenu").then((mod) => mod.MobileMenu), { ssr: false });

type NavLink = { label: string; href: string };

export function Navbar({
  links,
  logo,
  book,
  call,
  instagram,
}: {
  links: readonly NavLink[];
  logo: React.ReactNode;
  book: NavLink;
  call: NavLink;
  instagram: NavLink;
}) {
  const [hidden, setHidden] = useState(false);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const wasOpen = useRef(false);
  const openRef = useRef(open);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const ready = useMotionReady();
  const lenis = useSyncExternalStore(subscribeLenis, getLenis, () => null);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Hide on scroll down, show on scroll up, shrink after the hero. The position comes from the
  // motion engine (ScrollTrigger, kept in sync by Lenis), so there is no extra scroll listener.
  useEffect(() => {
    let lastY = 0;
    return subscribeScroll((y) => {
      const delta = y - lastY;
      lastY = y;
      setCompact(y > window.innerHeight * 0.75);
      if (openRef.current) return;
      if (y < 140) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
    });
  }, []);

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

  // Mobile menu: lock scroll, make the page behind it inert, Esc closes, focus returns on close.
  useEffect(() => {
    const root = document.documentElement;
    const inertTargets = document.querySelectorAll<HTMLElement>("[data-menu-inert]");
    if (open) {
      wasOpen.current = true;
      lenis?.stop();
      root.style.overflow = "hidden";
      root.setAttribute("data-menu-open", "");
      inertTargets.forEach((el) => el.setAttribute("inert", ""));
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
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
      <header
        data-hidden={hidden && !open}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 transition-[translate] duration-500 ease-out data-[hidden=true]:translate-y-[-130%] sm:px-4 sm:pt-4"
      >
        <div
          data-compact={compact && !open}
          className="glass pointer-events-auto flex h-14 w-full max-w-[960px] items-center justify-between gap-4 rounded-full pr-1.5 pl-5 transition-[scale] duration-500 ease-out data-[compact=true]:scale-[0.97] lg:h-15 lg:pr-2 lg:pl-6"
        >
          <a href="#top" className="-m-2 flex items-center rounded-full p-2 text-[23px] lg:text-[24px]">
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
                <span
                  className={cn(
                    "absolute top-0 left-0 h-[1.5px] w-5 rounded-full bg-ink transition-[translate,rotate] duration-500 ease-out",
                    open && "translate-y-[5.25px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[1.5px] w-5 rounded-full bg-ink transition-[translate,rotate] duration-500 ease-out",
                    open && "translate-y-[-5.25px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {ready ? (
        <MobileMenu
          open={open}
          onClose={() => setOpen(false)}
          onNavigate={goTo}
          links={links}
          book={book}
          call={call}
          instagram={instagram}
        />
      ) : null}
    </>
  );
}
