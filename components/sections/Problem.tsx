import Image from "next/image";
import { Parallax, SplitHeading } from "@/components/motion/scenes";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { images } from "@/content/images";
import { site } from "@/content/site";
import { whatsappHref } from "@/lib/links";

export function Problem() {
  const { problem, cta } = site;
  return (
    <section aria-labelledby="problem-title" className="py-24 sm:py-32 lg:py-40">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SplitHeading id="problem-title" order={20} className="max-w-[13ch] font-display text-h2 font-medium text-ink">
              {problem.title}
            </SplitHeading>
            <p data-reveal className="mt-6 max-w-[44ch] text-lead text-muted">
              {problem.body}
            </p>
            <div
              data-reveal
              className="relative mt-10 aspect-[4/5] max-h-[520px] overflow-hidden rounded-card bg-sand shadow-float sm:aspect-[16/11] lg:aspect-[4/5]"
            >
              <Parallax className="absolute inset-x-0 -inset-y-[8%]" order={21}>
                <Image
                  src={images.detailVinTyre}
                  alt={problem.imageAlt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 36vw, (min-width: 640px) 90vw, 100vw"
                  className="object-cover"
                />
              </Parallax>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pt-4">
          <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {problem.findings.map((finding, index) => (
              <li key={finding.title} data-reveal style={{ "--d": (index % 2) * 90 } as React.CSSProperties}>
                <span className="grid h-12 w-12 place-items-center rounded-full border border-ink/10 bg-ivory text-ink shadow-soft">
                  <Icon name={finding.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-[1.75rem] leading-[1.1] font-medium text-ink">{finding.title}</h3>
                <p className="mt-2.5 max-w-[34ch] leading-relaxed text-muted">{finding.body}</p>
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-16 rounded-[28px] bg-sand/60 p-1.5 ring-1 ring-ink/5 sm:mt-20">
            <div className="rounded-[22px] bg-ivory p-7 shadow-soft sm:p-10">
              <p className="font-display text-h3 font-medium text-ink">{problem.callout.title}</p>
              <p className="mt-3 max-w-[48ch] text-lead text-muted">{problem.callout.body}</p>
              <ButtonLink href={whatsappHref()} badge="whatsapp" external className="mt-7">
                {cta.book}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
