import Image from "next/image";
import { LensMark } from "@/components/brand/LensMark";
import { InstagramIcon } from "@/components/brand/SocialIcons";
import { SplitHeading } from "@/components/motion/scenes";
import { ButtonLink, Container, Eyebrow } from "@/components/ui/primitives";
import { images } from "@/content/images";
import { site } from "@/content/site";

export function InstagramStrip() {
  const { instagram, contact, cta } = site;
  return (
    <section aria-labelledby="instagram-title" className="section-y-24 sm:section-y-32">
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow>{instagram.eyebrow}</Eyebrow>
            <SplitHeading id="instagram-title" order={100} className="mt-5 max-w-[16ch] font-display text-h2 font-medium text-ink">
              {instagram.title}
            </SplitHeading>
            <p data-reveal className="mt-5 max-w-[46ch] text-lead text-muted">
              {instagram.body}
            </p>
          </div>
          <ButtonLink
            href={contact.instagram}
            variant="secondary"
            external
            leading={<InstagramIcon className="h-5 w-5" />}
            className="self-start lg:self-auto"
          >
            {cta.follow}
          </ButtonLink>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
          {instagram.tiles.map((tile, index) => (
            <li key={index} data-reveal style={{ "--d": index * 60 } as React.CSSProperties}>
              <a
                href={contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group @container relative block aspect-square overflow-hidden rounded-[22px] bg-sand"
              >
                {tile.kind === "image" ? (
                  <Image
                    src={images[tile.image]}
                    alt={tile.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 31vw, 48vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                  />
                ) : (
                  <span className="flex h-full flex-col justify-between border border-ink/10 bg-ivory p-4 sm:p-5">
                    <LensMark className="h-6 w-6" />
                    {/* Sized by the tile's width, so a long tip always fits its square */}
                    <span className="font-display text-[length:clamp(0.875rem,8cqi,1.25rem)] leading-snug font-medium text-ink">
                      {tile.text}
                    </span>
                  </span>
                )}
                <span className="sr-only"> (opens Instagram)</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 grid place-items-center bg-navy/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <InstagramIcon mono className="h-8 w-8 text-ivory" />
                </span>
              </a>
              <p className="mt-2.5 font-mono text-[10.5px] tracking-[0.14em] text-muted uppercase">{tile.category}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
