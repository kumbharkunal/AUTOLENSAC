"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/brand/SocialIcons";

/** Mobile-only WhatsApp button: appears after the hero, steps aside for the final CTA. */
export function FloatingWhatsApp({ href, label }: { href: string; label: string }) {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const hero = document.getElementById("top");
    const finalCta = document.getElementById("book");
    const state = { pastHero: false, atCta: false };
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) state.pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        if (entry.target === finalCta) state.atCta = entry.isIntersecting;
      }
      setVisible(state.pastHero && !state.atCta);
    });
    if (hero) io.observe(hero);
    if (finalCta) io.observe(finalCta);
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <m.a
          key="fab"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          data-menu-inert
          className="fab fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[45] grid h-14 w-14 place-items-center rounded-full shadow-lift ring-[3px] ring-ivory md:hidden"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 30 }}
        >
          <WhatsAppIcon tone="badge" className="h-14 w-14" />
        </m.a>
      ) : null}
    </AnimatePresence>
  );
}
