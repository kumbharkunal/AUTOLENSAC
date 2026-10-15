import { getImageProps } from "next/image";
import { LensMark } from "@/components/brand/LensMark";
import { HeroMotion } from "@/components/motion/scenes";
import { renderAccent } from "@/components/ui/accent";
import { ButtonLink } from "@/components/ui/primitives";
import { images } from "@/content/images";
import { site } from "@/content/site";
import { telHref, whatsappHref } from "@/lib/links";

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

/** Shared focal point (where the lens opens) for the hero and the intro overlay. */
export function heroFocalVars(): CSSVars {
  const { focal } = site.hero;
  return {
    "--fx-d": `${focal.desktop.x}%`,
    "--fy-d": `${focal.desktop.y}%`,
    "--fx-m": `${focal.mobile.x}%`,
    "--fy-m": `${focal.mobile.y}%`,
  };
}

/** First-visit lens intro (CSS only; the head script decides if it plays). */
export function Intro() {
  if (!site.features.intro) return null;
  return (
    <div className="intro" aria-hidden="true" style={heroFocalVars()}>
      <LensMark className="intro__lens" />
    </div>
  );
}

function Lines({ lines, variant }: { lines: readonly string[]; variant: "mobile" | "tablet" | "desktop" }) {
  const visibility = {
    mobile: "block sm:hidden",
    tablet: "hidden sm:block lg:hidden",
    desktop: "hidden lg:block",
  }[variant];
  return (
    <span aria-hidden="true" className={`hero-title--${variant} ${visibility}`}>
      {lines.map((line, index) => (
        <span key={line} className="hero-line whitespace-nowrap" style={{ "--i": index } as CSSVars}>
          <span>{renderAccent(line)}</span>
        </span>
      ))}
    </span>
  );
}

function Chip({ label, value, index }: { label: string; value: string; index: number }) {
  return (
    <div className="chip-float" style={{ "--i": index } as CSSVars}>
      <div
        className="chip-in chip-surface flex items-center gap-2.5 rounded-full py-2 pr-3.5 pl-2.5 font-mono text-[11px] leading-none tracking-[0.12em] whitespace-nowrap uppercase sm:text-[11.5px]"
        style={{ "--i": index } as CSSVars}
      >
        <span className="relative grid h-5 w-5 place-items-center rounded-full bg-lens/12">
          <span className="h-1.5 w-1.5 rounded-full bg-lens" />
        </span>
        <span className="text-muted">{label}</span>
        <span className="font-medium text-lens">{value}</span>
      </div>
    </div>
  );
}

export function Hero() {
  const { hero, cta, contact } = site;

  const common = { alt: hero.imageAlt, sizes: "100vw", quality: 80 };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: images.heroDesktop });
  const {
    props: { srcSet: mobileSrcSet, ...mobileImg },
  } = getImageProps({ ...common, src: images.heroMobile, fetchPriority: "high", loading: "eager" });

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative px-2 pt-2 sm:px-3 sm:pt-3"
      style={heroFocalVars()}
    >
      <HeroMotion className="relative isolate flex min-h-[calc(100svh-16px)] flex-col overflow-hidden rounded-[24px] bg-sand sm:min-h-[calc(100svh-24px)] md:rounded-[36px]">
        {/* Photograph (the LCP element: painted immediately, under the veil) */}
        <div data-hero-media className="hero-media absolute inset-x-0 -top-[12%] bottom-0">
          <picture>
            <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes="100vw" />
            <img
              {...mobileImg}
              srcSet={mobileSrcSet}
              alt={hero.imageAlt}
              className="h-full w-full object-cover object-[50%_40%] md:object-[60%_45%]"
            />
          </picture>
        </div>

        {/* Defocus veil: the photo's own blur placeholder, opened by the lens aperture */}
        <div className="hero-veil" aria-hidden="true">
          <span className="hero-veil__img md:hidden" style={{ backgroundImage: `url(${images.heroMobile.blurDataURL})` }} />
          <span
            className="hero-veil__img hidden md:block"
            style={{ backgroundImage: `url(${images.heroDesktop.blurDataURL})` }}
          />
        </div>

        {/* Scrims keep the type at AA contrast on any photograph */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 z-[2] h-36 bg-linear-to-b from-cream/70 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 z-[2] h-[68%] bg-linear-to-t from-cream from-12% via-cream/80 via-45% to-transparent md:h-[58%] md:from-cream/95"
        />

        {/* Report chips */}
        {hero.chips.map((chip, index) => (
          <div
            key={`d-${chip.label}`}
            data-depth={40 + index * 26}
            className="absolute z-[3] hidden md:block"
            style={{ left: `${chip.desktop.x}%`, top: `${chip.desktop.y}%` }}
          >
            <Chip label={chip.label} value={chip.value} index={index} />
          </div>
        ))}
        {hero.chips.map((chip, index) =>
          chip.mobile ? (
            <div
              key={`m-${chip.label}`}
              data-depth={24 + index * 18}
              className="absolute z-[3] md:hidden"
              style={{ left: `${chip.mobile.x}%`, top: `${chip.mobile.y}%` }}
            >
              <Chip label={chip.label} value={chip.value} index={index} />
            </div>
          ) : null,
        )}

        {/* Copy */}
        <div data-hero-content className="relative z-[4] mt-auto px-5 pt-40 pb-6 sm:px-8 sm:pb-9 lg:px-14 lg:pb-14">
          <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-8">
              <p
                className="hero-fade mb-5 inline-flex items-center gap-2.5 font-mono text-[11.5px] leading-none font-medium tracking-[0.16em] text-ink/70 uppercase sm:mb-7 sm:text-[12px]"
                style={{ "--d": "0.2s" } as CSSVars}
              >
                <LensMark className="h-3.5 w-3.5" />
                {hero.eyebrow}
              </p>
              <h1 id="hero-title" className="font-display leading-[1.02] font-medium tracking-[-0.02em] text-ink">
                <span className="sr-only">{hero.title}</span>
                <Lines lines={hero.lines.mobile} variant="mobile" />
                <Lines lines={hero.lines.tablet} variant="tablet" />
                <Lines lines={hero.lines.desktop} variant="desktop" />
              </h1>
            </div>
            <div className="lg:col-span-4 lg:pb-2">
              <p
                className="hero-fade max-w-[34ch] text-[1.0625rem] leading-relaxed text-ink/80 sm:text-lg"
                style={{ "--d": "0.75s" } as CSSVars}
              >
                {hero.subtitle}
              </p>
              <div
                className="hero-fade mt-6 flex flex-wrap items-center gap-3"
                style={{ "--d": "0.9s" } as CSSVars}
              >
                <ButtonLink href={whatsappHref()} badge="whatsapp" external>
                  {cta.book}
                </ButtonLink>
                <ButtonLink
                  href={telHref}
                  variant="secondary"
                  badge="phone"
                  ariaLabel={`Call ${contact.phoneDisplay}`}
                  className="bg-ivory/40"
                >
                  <span className="sm:hidden">{cta.call}</span>
                  <span className="hidden sm:inline">
                    {cta.call} {contact.phoneShort}
                  </span>
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </HeroMotion>
    </section>
  );
}
