"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/brand/SocialIcons";
import { cn } from "@/lib/cn";

/** Mobile-only WhatsApp button: springs in after the hero, steps aside for the final CTA. */
export function FloatingWhatsApp({ href, label }: { href: string; label: string }) {
  const [visible, setVisible] = useState(false);

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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      aria-hidden={!visible || undefined}
      tabIndex={visible ? undefined : -1}
      data-menu-inert
      className={cn(
        "fab fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[45] grid h-14 w-14 place-items-center rounded-full shadow-lift ring-[3px] ring-ivory md:hidden",
        "transition-[opacity,scale] duration-500 ease-spring",
        visible ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0",
      )}
    >
      <WhatsAppIcon tone="badge" className="h-14 w-14" />
    </a>
  );
}
