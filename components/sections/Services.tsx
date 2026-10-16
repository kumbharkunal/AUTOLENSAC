import { ArrowUpRightIcon, CarProfileIcon, MotorcycleIcon } from "@phosphor-icons/react/dist/ssr";
import Image, { type StaticImageData } from "next/image";
import { SplitHeading } from "@/components/motion/scenes";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/primitives";
import { images } from "@/content/images";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { whatsappHref } from "@/lib/links";

type Service = (typeof site.services.items)[number];

function AppliesTo({ tone = "default" }: { tone?: "default" | "ivory" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase",
        tone === "ivory" ? "text-ivory/80" : "text-muted",
      )}
    >
      <CarProfileIcon weight="regular" className="h-4 w-4" aria-hidden="true" />
      <MotorcycleIcon weight="regular" className="h-4 w-4" aria-hidden="true" />
      <span>{site.services.appliesTo}</span>
    </span>
  );
}

/** Double-bezel shell: a sand tray holding an ivory core. */
function Shell({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <li
      data-reveal
      className={cn(
        "group rounded-[28px] bg-sand/55 p-1.5 ring-1 ring-ink/5 transition-transform duration-500 ease-out hover:-translate-y-0.5",
        className,
      )}
    >
      <article className="relative flex h-full flex-col overflow-hidden rounded-[22px] bg-ivory shadow-soft">{children}</article>
    </li>
  );
}

function CardText({ service, className }: { service: Service; className?: string }) {
  return (
    <div className={cn("flex flex-1 flex-col p-6 sm:p-8", className)}>
      <div className="flex items-center justify-between gap-4">
        <span className="grid h-11 w-11 place-items-center rounded-full border border-ink/10 text-ink transition-colors duration-300 group-hover:border-lens/40 group-hover:text-lens">
          <Icon name={service.icon} className="h-[22px] w-[22px]" />
        </span>
        <AppliesTo />
      </div>
      <h3 className="mt-6 font-display text-h3 font-medium text-ink">{service.title}</h3>
      <p className="mt-3 max-w-[46ch] leading-relaxed text-muted">{service.body}</p>
    </div>
  );
}

function Photo({ src, alt, sizes, className }: { src: StaticImageData; alt: string; sizes: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-sand", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        placeholder="blur"
        sizes={sizes}
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
      />
    </div>
  );
}

export function Services() {
  const { services, cta, contact } = site;
  const [engine, paint, odometer, hidden, consult] = services.items;

  return (
    <section id={services.id} aria-labelledby="services-title" className="section-y-24 sm:section-y-32 lg:section-y-40">
      <Container>
        <div className="max-w-[44rem]">
          <SplitHeading id="services-title" order={30} className="font-display text-h2 font-medium text-ink">
            {services.title}
          </SplitHeading>
          <p data-reveal className="mt-6 max-w-[46ch] text-lead text-muted">
            {services.body}
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-12 lg:grid-rows-[auto_auto_auto] lg:gap-5">
          {/* A: engine & battery (large, photo) */}
          <Shell className="lg:col-span-7 lg:row-span-2">
            <Photo
              src={images.diagnosticTablet}
              alt={engine.imageAlt ?? ""}
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="aspect-[16/10] lg:aspect-auto lg:flex-1"
            />
            <CardText service={engine} className="flex-none" />
          </Shell>

          {/* B: accident & paint (photo beside text on wide screens) */}
          <Shell className="lg:col-span-5">
            <div className="flex h-full flex-col sm:flex-row lg:flex-col xl:flex-row">
              <Photo
                src={images.paintGauge}
                alt={paint.imageAlt ?? ""}
                sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 40vw, (min-width: 640px) 40vw, 100vw"
                className="aspect-[16/10] sm:aspect-auto sm:w-[42%] lg:aspect-[16/9] lg:w-full xl:aspect-auto xl:w-[40%]"
              />
              <CardText service={paint} />
            </div>
          </Shell>

          {/* C: odometer & electrical (typographic readout) */}
          <Shell className="lg:col-span-5">
            <CardText service={odometer} className="pb-4 sm:pb-5" />
            <dl className="mx-6 mb-6 grid gap-2.5 rounded-[18px] bg-cream/80 p-4 font-mono text-[12px] tracking-[0.12em] uppercase sm:mx-8 sm:mb-8">
              {odometer.readouts?.map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <dt className="text-muted">{row.label}</dt>
                  <span aria-hidden="true" className="leader text-ink" />
                  <dd className="font-medium text-lens">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Shell>

          {/* D: hidden-problem detection (bike photo) */}
          <Shell className="lg:col-span-6">
            <div className="flex h-full flex-col sm:flex-row">
              <Photo
                src={images.bikeInspection}
                alt={hidden.imageAlt ?? ""}
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 100vw"
                className="aspect-square sm:aspect-auto sm:w-[44%]"
              />
              <CardText service={hidden} />
            </div>
          </Shell>

          {/* E: consultation (tinted typographic cell) */}
          <li data-reveal className="group rounded-[28px] bg-lens/[0.07] p-1.5 ring-1 ring-lens/10 lg:col-span-6">
            <article className="relative flex h-full flex-col justify-between overflow-hidden rounded-[22px] bg-ivory bg-linear-to-br from-ivory to-lens/[0.07] p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-lens text-ivory">
                    <Icon name={consult.icon} className="h-[22px] w-[22px]" />
                  </span>
                  <AppliesTo />
                </div>
                <h3 className="mt-6 font-display text-h3 font-medium text-ink">{consult.title}</h3>
                <p className="mt-3 max-w-[46ch] leading-relaxed text-muted">{consult.body}</p>
              </div>
              <a
                href={whatsappHref(contact.consultMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex min-h-11 items-center gap-2 self-start font-medium text-lens underline decoration-lens/30 underline-offset-[6px] transition-colors hover:decoration-lens"
              >
                {cta.consult}
                <ArrowUpRightIcon
                  weight="regular"
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </article>
          </li>
        </ul>
      </Container>
    </section>
  );
}
