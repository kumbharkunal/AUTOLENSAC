import { SplitHeading } from "@/components/motion/scenes";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { Container } from "@/components/ui/primitives";
import { site } from "@/content/site";
import { whatsappHref } from "@/lib/links";

export function Faq() {
  const { faq } = site;
  return (
    <section id={faq.id} aria-labelledby="faq-title" className="section-y-24 sm:section-y-32 lg:section-y-40">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SplitHeading id="faq-title" order={110} className="font-display text-h2 font-medium text-ink">
              {faq.title}
            </SplitHeading>
            <p data-reveal className="mt-5 max-w-[30ch] text-lead text-muted">
              Something else on your mind?{" "}
              <a
                href={whatsappHref("Hi AutoLens, I have a question about PDI: ")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lens underline decoration-lens/30 underline-offset-[5px] transition-colors hover:decoration-lens"
              >
                Ask us on WhatsApp
              </a>
              .
            </p>
          </div>
        </div>
        <div className="lg:col-span-8">
          <FaqAccordion items={faq.items} />
        </div>
      </Container>
    </section>
  );
}
