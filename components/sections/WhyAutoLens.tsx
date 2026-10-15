import Image from "next/image";
import { Parallax, SplitHeading } from "@/components/motion/scenes";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/primitives";
import { images } from "@/content/images";
import { site } from "@/content/site";

export function WhyAutoLens() {
  const { why } = site;
  return (
    <section id={why.id} aria-labelledby="why-title" className="py-24 sm:py-32 lg:py-40">
      <Container className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div
            data-reveal
            className="relative aspect-[4/5] overflow-hidden rounded-card bg-sand shadow-float lg:sticky lg:top-28"
          >
            <Parallax className="absolute inset-x-0 -inset-y-[8%]" order={90}>
              <Image
                src={images.handover}
                alt={why.imageAlt}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 36vw, 100vw"
                className="object-cover"
              />
            </Parallax>
          </div>
        </div>

        <div className="lg:col-span-7">
          <SplitHeading id="why-title" order={91} className="max-w-[18ch] font-display text-h2 font-medium text-ink">
            {why.title}
          </SplitHeading>
          <ul className="mt-12 grid grid-cols-1 gap-11 sm:mt-14">
            {why.pillars.map((pillar, index) => (
              <li
                key={pillar.title}
                data-reveal
                style={{ "--d": index * 70 } as React.CSSProperties}
                className="grid grid-cols-[auto_1fr] gap-5 sm:gap-7"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full border border-lens/25 bg-ivory text-lens shadow-soft">
                  <Icon name={pillar.icon} className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="font-display text-h3 font-medium text-ink">{pillar.title}</h3>
                  <p className="mt-2 max-w-[46ch] leading-relaxed text-muted">{pillar.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
