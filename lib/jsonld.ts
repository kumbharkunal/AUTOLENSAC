import { site } from "@/content/site";
import { siteUrl } from "@/lib/links";

/** Serialises JSON-LD safely for a <script> tag (escapes "<" to prevent injection). */
export function toJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function businessJsonLd() {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "@id": `${url}/#business`,
    name: site.brand.name,
    description: site.brand.description,
    slogan: site.brand.positioning,
    url,
    telephone: site.contact.phoneSchema,
    logo: `${url}/apple-icon.png`,
    image: `${url}/opengraph-image`,
    sameAs: [site.contact.instagram],
    // TODO: confirm with client: add "address", "areaServed", "openingHours" and "priceRange" once known.
    knowsAbout: ["Pre-delivery inspection (PDI)", "Computerized vehicle diagnosis", "New car inspection", "Two-wheeler inspection"],
    makesOffer: site.services.items.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.title, description: service.body },
    })),
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
