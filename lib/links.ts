import { site } from "@/content/site";

/** wa.me deep link with a prefilled message. */
export function whatsappHref(message: string = site.contact.whatsappMessage) {
  return `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const telHref = `tel:${site.contact.phoneE164}`;

/** Absolute site URL: Vercel's production URL when deployed there, otherwise content/site.ts. */
export function siteUrl() {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return vercel ? `https://${vercel}` : site.siteUrl;
}
