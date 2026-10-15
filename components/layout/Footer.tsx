import { Logo } from "@/components/brand/Logo";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "@/components/brand/SocialIcons";
import { Container } from "@/components/ui/primitives";
import { site } from "@/content/site";
import { siteUrl, telHref, whatsappHref } from "@/lib/links";

const linkClass =
  "inline-flex min-h-11 items-center gap-2.5 text-[15px] text-ink/80 transition-colors hover:text-lens";

export function Footer() {
  const { brand, contact, footer, services, copyrightYear } = site;
  const facebook = contact.facebook
    ? { href: contact.facebook, label: "AutoLens on Facebook" }
    : // TODO: confirm with client: no Facebook page yet, so this shares the site instead.
      { href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl())}`, label: "Share on Facebook" };

  return (
    <footer id="site-footer" data-menu-inert className="pb-8">
      <Container className="pt-20 sm:pt-28">
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <a href="#top" className="inline-block rounded-md text-[42px] sm:text-[48px]" aria-label="AutoLens, back to top">
              <Logo subline />
            </a>
            <p className="mt-7 max-w-[34ch] text-lead text-muted">{brand.positioning}</p>
          </div>

          <nav aria-labelledby="footer-services" className="lg:col-span-3">
            <h2 id="footer-services" className="text-label text-muted">
              {footer.servicesTitle}
            </h2>
            <ul className="mt-4">
              {services.items.map((service) => (
                <li key={service.id}>
                  <a href="#services" className={linkClass}>
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="text-label text-muted">{footer.contactTitle}</h2>
            <ul className="mt-4">
              <li>
                <a href={telHref} className={linkClass}>
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp
                </a>
              </li>
              {contact.email ? (
                <li>
                  <a href={`mailto:${contact.email}`} className={linkClass}>
                    {contact.email}
                  </a>
                </li>
              ) : null}
              <li>
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {contact.instagramHandle}
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-label text-muted">{footer.areasTitle}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink/80">
              {contact.serviceAreas.length ? contact.serviceAreas.join(", ") : footer.areasPlaceholder}
            </p>
            <h2 className="mt-8 text-label text-muted">{footer.followTitle}</h2>
            <ul className="mt-3 flex items-center gap-1">
              <li>
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AutoLens on Instagram"
                  className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-ink/[0.05]"
                >
                  <InstagramIcon className="h-[22px] w-[22px]" />
                </a>
              </li>
              <li>
                <a
                  href={facebook.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={facebook.label}
                  className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-ink/[0.05]"
                >
                  <FacebookIcon className="h-[22px] w-[22px]" />
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with AutoLens on WhatsApp"
                  className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-ink/[0.05]"
                >
                  <WhatsAppIcon className="h-[22px] w-[22px]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-ink/10 pt-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {copyrightYear} {brand.name}. All rights reserved.
          </p>
          <p>{footer.legal}</p>
        </div>
      </Container>
    </footer>
  );
}
