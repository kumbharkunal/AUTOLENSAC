import { LensMark } from "@/components/brand/LensMark";
import { ProcessLine, SplitHeading } from "@/components/motion/scenes";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/ui/primitives";
import { site } from "@/content/site";

export function Process() {
  const { process } = site;
  return (
    <section id={process.id} aria-labelledby="process-title" className="section-y-24 sm:section-y-32 lg:section-y-40">
      <Container>
        <SplitHeading id="process-title" order={65} className="max-w-[16ch] font-display text-h2 font-medium text-ink">
          {process.title}
        </SplitHeading>

        <ProcessLine className="relative mt-16 sm:mt-20">
          {/* Track and its scroll-drawn fill: vertical on mobile, horizontal on desktop */}
          <div
            aria-hidden="true"
            className="absolute top-5 bottom-5 left-5 w-px bg-ink/12 lg:top-5 lg:right-5 lg:bottom-auto lg:left-5 lg:h-px lg:w-auto"
          >
            <div data-process-fill className="h-full w-full origin-top bg-lens lg:origin-left" />
          </div>

          <ol className="relative grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-10">
            {process.steps.map((step, index) => (
              <li key={step.verb} data-reveal style={{ "--d": index * 90 } as React.CSSProperties} className="relative pl-16 lg:pt-20 lg:pl-0">
                <span
                  data-node
                  data-on=""
                  className="absolute top-0 left-0 grid h-10 w-10 place-items-center rounded-full bg-cream ring-1 ring-ink/15"
                >
                  <LensMark className="h-5 w-5" />
                </span>
                <p className="font-display text-[clamp(2.25rem,1.8rem+1.6vw,3.25rem)] leading-none font-medium text-ink italic">
                  {step.verb}
                </p>
                <h3 className="mt-4 flex items-center gap-2.5 text-[17px] font-medium text-ink">
                  <Icon name={step.icon} className="h-5 w-5 text-lens" weight="regular" />
                  {step.title}
                </h3>
                <p className="mt-2.5 max-w-[34ch] leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </ProcessLine>
      </Container>
    </section>
  );
}
