import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero, Intro } from "@/components/sections/Hero";
import { InstagramStrip } from "@/components/sections/InstagramStrip";
import { ModelsMarquee } from "@/components/sections/ModelsMarquee";
import { Problem } from "@/components/sections/Problem";
import { Process } from "@/components/sections/Process";
import { ReportPreview } from "@/components/sections/ReportPreview";
import { Services } from "@/components/sections/Services";
import { Statement } from "@/components/sections/Statement";
import { Testimonials } from "@/components/sections/Testimonials";
import { UnderTheLens } from "@/components/sections/under-the-lens/UnderTheLens";
import { WhyAutoLens } from "@/components/sections/WhyAutoLens";
import { site } from "@/content/site";
import { businessJsonLd, faqJsonLd, toJsonLd } from "@/lib/jsonld";

// The whole homepage must stay fully static (prerendered at build, served from the CDN).
export const ensureStatic = "navigation";

export default function Home() {
  return (
    <>
      <Intro />
      <Hero />
      <Statement />
      <ModelsMarquee label={site.models.label} items={site.models.items} />
      <Problem />
      <Services />
      <UnderTheLens />
      <Process />
      <ReportPreview />
      <WhyAutoLens />
      <Testimonials />
      <InstagramStrip />
      <Faq />
      <FinalCta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(businessJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd()) }} />
    </>
  );
}
