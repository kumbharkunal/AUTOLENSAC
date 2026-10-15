import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Logo } from "@/components/brand/Logo";
import { BrandGradients } from "@/components/brand/SocialIcons";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { site } from "@/content/site";
import { siteUrl, telHref, whatsappHref } from "@/lib/links";

// Static 500 weight (the only display weight used): about 30 KB lighter than the variable font.
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: "500",
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: site.seo.title,
  description: site.seo.description,
  keywords: [...site.seo.keywords],
  applicationName: site.brand.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.brand.name,
    title: site.seo.title,
    description: site.seo.description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4ede2",
  colorScheme: "light",
};

// Runs before first paint: marks JS as available (for scroll reveals) and decides whether the
// first-visit lens intro plays (never under reduced motion, once per browser session).
const bootScript = `(function(){var d=document.documentElement;d.classList.add("js");try{if(${site.features.intro}&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches&&!sessionStorage.getItem("al-intro")){d.classList.add("intro-play");sessionStorage.setItem("al-intro","1")}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-dvh bg-cream text-ink">
        <BrandGradients />
        <a
          href="#main"
          className="sr-only rounded-full bg-ink px-5 py-3 text-sm font-medium text-ivory focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100"
        >
          Skip to content
        </a>
        <MotionRoot cursor={site.features.cursor}>
          <Navbar
            links={site.nav}
            logo={<Logo />}
            book={{ href: whatsappHref(), label: site.cta.book }}
            call={{ href: telHref, label: `${site.cta.call} ${site.contact.phoneShort}` }}
            instagram={{ href: site.contact.instagram, label: site.contact.instagramHandle }}
          />
          <main id="main" tabIndex={-1} data-menu-inert className="outline-none">
            {children}
          </main>
          <Footer />
          <FloatingWhatsApp href={whatsappHref()} label={`${site.cta.book} on WhatsApp`} />
        </MotionRoot>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
