import Image from "next/image";
import { LensMark } from "@/components/brand/LensMark";
import { InstagramIcon } from "@/components/brand/SocialIcons";
import { CtaRings } from "@/components/motion/scenes";
import { renderAccent } from "@/components/ui/accent";
import { ButtonLink } from "@/components/ui/primitives";
import { images } from "@/content/images";
import { site } from "@/content/site";
import { telHref, whatsappHref } from "@/lib/links";

/** The page's one deliberate navy surface: an inset plate, not a theme flip. */
export function FinalCta() {
  const { finalCta, cta, contact } = site;
  return (
    <section id={finalCta.id} aria-labelledby="cta-title" className="px-2 sm:px-3">
      <CtaRings className="on-navy relative isolate overflow-hidden rounded-[24px] bg-navy px-5 py-24 text-center sm:py-32 md:rounded-[36px] lg:py-40">
        <Image
          src={images.ctaBg}
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover opacity-20"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_10%,var(--color-navy)_75%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 grid place-items-center">
          {[34, 56, 80, 108].map((size) => (
            <span
              key={size}
              data-ring
              className="absolute aspect-square rounded-full border border-ivory/[0.09]"
              style={{ width: `${size}vmax` }}
            />
          ))}
        </div>

        <LensMark tone="ivory" className="mx-auto h-12 w-12" />
        <h2
          id="cta-title"
          className="mx-auto mt-8 max-w-[18ch] font-display text-[clamp(2.6rem,1.4rem+5vw,6rem)] leading-[1.02] font-medium tracking-[-0.02em] text-ivory"
        >
          {finalCta.title.map((line) => (
            <span key={line} className="block">
              {renderAccent(line)}
            </span>
          ))}
        </h2>
        <p className="mx-auto mt-6 max-w-[32ch] text-lead text-ivory/75">{finalCta.body}</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={whatsappHref()} variant="dark-primary" badge="whatsapp" external>
            {cta.book}
          </ButtonLink>
          <ButtonLink href={telHref} variant="dark-secondary" badge="phone" ariaLabel={`Call ${contact.phoneDisplay}`}>
            {cta.call} {contact.phoneShort}
          </ButtonLink>
          <ButtonLink
            href={contact.instagram}
            variant="dark-secondary"
            external
            leading={<InstagramIcon className="h-5 w-5" />}
          >
            {contact.instagramHandle}
          </ButtonLink>
        </div>
      </CtaRings>
    </section>
  );
}
