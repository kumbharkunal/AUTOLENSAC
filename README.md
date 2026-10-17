# AutoLens: homepage

A pitch homepage for **AutoLens** ([@autolensac](https://www.instagram.com/autolensac/)), a pre-delivery inspection (PDI) and vehicle consultancy for new cars and bikes. Light, editorial and photography-led, built around the idea of a lens: the page arrives slightly out of focus and resolves into clarity.

- **Stack:** Next.js 16.4 (App Router, TypeScript), Tailwind CSS 4, GSAP 3.15 (ScrollTrigger, SplitText, `@gsap/react`), Lenis, Motion, Phosphor icons. Deploys to Vercel with no environment variables.
- **Measured** (Lighthouse mobile, local production build): Performance 91 with placeholder images on a quiet laptop · Accessibility 100 · Best Practices 100 · SEO 100 (CLS ≤ 0.002). The real photos add about 35 KB to the phone hero (AVIF). Local Performance scores swing widely with how busy the laptop is (the same build has scored anywhere from 39 to 91), so measure the deployed URL with PageSpeed Insights.
- **Research and design docs:** [`research/client-brief.md`](research/client-brief.md) · [`research/design-rules.md`](research/design-rules.md) · [`IMAGE_PROMPTS.md`](IMAGE_PROMPTS.md)

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (type-checks too)
npm run start        # serve the production build
npm run lint         # ESLint
npm run typecheck    # TypeScript only
```

Node.js 20.9 or newer (Vercel uses Node 24 by default).

---

## Change the words: `content/site.ts`

Every piece of copy, every link and every feature flag lives in **`content/site.ts`**. Components only read from it.

- **Accent words:** wrap a word in asterisks to set it in italic royal blue, e.g. `"without *PDI.*"`.
- **Hero headline:** `hero.lines` holds the headline broken into lines for phones, tablets and desktops (the line breaks are designed, not automatic). If you change `hero.title`, update all three line sets to the same words.
- **Contact:** phone, WhatsApp number and prefilled message, Instagram and other links are in `contact`.
- **Feature flags:**
  - `features.intro`: the short lens intro on the first visit of a session.
  - `features.cursor`: the lens ring that follows the mouse on desktop.
  - `testimonials.enabled`: shows or hides the reviews section (it also hides itself when the list is empty).
- **House style:** no em-dashes or en-dashes in visible copy; Indian English spelling ("tyre", "kilometres"); "computerized" as the client writes it.

Anything unconfirmed is marked `// TODO: confirm with client` in that file and listed below.

---

## Photographs

The site uses eleven photographs generated with the prompts in [`IMAGE_PROMPTS.md`](IMAGE_PROMPTS.md). They are AI-generated stand-ins (see the client list below). To replace any of them:

1. Generate each image in ChatGPT with the prompts in **[`IMAGE_PROMPTS.md`](IMAGE_PROMPTS.md)**. They are listed in priority order and each one is self-contained.
2. Save them in **`/raw-images`** with the exact names given (e.g. `raw-images/hero-desktop.png`). Any size or shape works. The raw files themselves are not committed.
3. Run:
   ```bash
   npm run images                         # every image found in /raw-images
   npm run images -- hero-desktop lens-car  # or just some of them
   ```
   This fits each photo to its slot and writes **WebP + AVIF** to `/public/images` (plus a JPEG for the share image). `next/image` then serves AVIF/WebP at every screen size. How each photo is fitted is set per image in `scripts/image-specs.mjs`:
   - **inside** (most photos): the whole photo is kept and the page crops it to each layout.
   - **pad** (the two "Under the lens" studio shots): the photo is fitted into the 3:2 stage and its studio backdrop extended, so the whole vehicle stays in view.
   - **extend** (desktop hero): soft extra ceiling and window light are added to a tightly framed shot, so the subject sits right of the headline and below the navigation.
   - **cover** (share photo): cropped to exactly 1200×630.
4. Commit `public/images` and redeploy.

To go back to the generated placeholders: `npm run images:placeholders`. It only fills in missing files; `-- --force handover` redraws just the ones you name, and `-- --force` on its own overwrites everything, real photos included.

### Calibrate the "Under the lens" hotspots

The magnifier visits hotspots defined as fractions of the photo (`x`, `y` in `site.lens.kinds[].checkpoints`). They are calibrated for the current car and bike photos. After replacing `lens-car` or `lens-bike`:

1. `npm run dev` and open **http://localhost:3000/?hotspots** (this helper only exists in development).
2. Scroll to "Under the lens" and click the spot on the photo where a checkpoint should sit. The coordinates appear in the corner and in the browser console.
3. Copy them into `content/site.ts`. Keep hotspots at least about 30px apart on a phone.

---

## Replace the logo

No official logo file was available, so the wordmark is a faithful recreation of the Instagram profile logo:

- `components/brand/Logo.tsx`: navy "Aut", the magnifier "o", blue "Lens", optional sub-line.
- `components/brand/LensMark.tsx`: the magnifier "o" on its own, reused as the site's signature motif.

When the client sends the official SVG:

1. Replace the SVG inside `LensMark.tsx` (and, if needed, the wordmark markup in `Logo.tsx`).
2. Update the same mark in `scripts/make-icons.mjs` and run `npm run icons` to rebuild `app/icon.svg`, `app/apple-icon.png` and `app/favicon.ico`.
3. Update `LENS_MARK` in `app/opengraph-image.tsx` (the share card).
4. Re-sample the exact navy and blue and update `--color-navy` and `--color-lens` in `app/globals.css`.

---

## To confirm with the client

Everything below is a placeholder or an assumption in the current build:

1. **City and service areas.** The footer says "to be confirmed"; there's also an FAQ answer, and `areaServed` is missing from the structured data.
2. **Official logo file** (SVG), and whether the brand is written "AutoLens" or "Auto Lens" (Instagram shows the latter).
3. **WhatsApp number** (assumed to be the phone number, +91 88057 74390).
4. **Email address** (hidden until provided).
5. **Business hours.**
6. **Facebook / YouTube / Google Business Profile** links. With no Facebook page, the footer's Facebook icon shares the site instead.
7. **Pricing.** The FAQ answer points to WhatsApp for a quote.
8. **Typical inspection duration** (FAQ).
9. **Report format and delivery.** PDF? WhatsApp? Same day? Photos included?
10. **Years in business / number of inspections.** No counters are shown until real figures exist.
11. **Real customer reviews**, with permission. The testimonials are clearly marked placeholders.
12. **What "certified technicians" refers to** (Why AutoLens pillar).
13. **The bike checklist.** It's adapted from the car checklist.
14. **What "AC" in @autolensac stands for.**
15. **Production domain.** Set `siteUrl` in `content/site.ts`; on Vercel the production URL is detected automatically.
16. **Are they independent of dealerships?** A strong selling point if true; not claimed anywhere yet.
17. **Photography.** All photos are AI-generated stand-ins (the inspector, cars, bike and showrooms). Swap in real shoots of the AutoLens team and inspections when available, using the same file names.

---

## Decisions made during the build

- **No Three.js.** The lens idea is carried by the hero aperture and the "Under the lens" magnifier at zero WebGL cost. A 3D element would cost 150 KB+ of JavaScript and put the mobile score at risk.
- **Motion off the critical path.** The hero's entrance (intro, lens aperture, line reveals, chips) is pure CSS, so it plays before any JavaScript arrives. Smooth scrolling and scroll choreography load on the first interaction, or 2.5s after the page has loaded:
  - Lenis, GSAP + ScrollTrigger + SplitText (still `useGSAP`, via lazily mounted effect components)
  - the inspector's scroll scene
  - the Motion mobile menu

  This took Lighthouse mobile from about 82 to 91 without dropping any effect.
- **Motion vs CSS.** Motion powers the mobile menu sheet (AnimatePresence, springs, staggered links). Simple state changes use CSS transitions with the same easing curves: navbar hide/shrink, hamburger morph, FAQ height, WhatsApp button. This keeps the Motion runtime out of the initial download.
- **Hero headline lines are authored.** Each breakpoint has hand-set lines, revealed by CSS rather than SplitText, so the headline animates without waiting for JavaScript. SplitText drives every section headline and the statement.
- **Short screens are first-class.** Windows laptops at 125–150% display scaling give the browser only about 560–730px of height, so nothing is allowed to be taller than the screen it sticks to:
  - "Under the lens" is a CSS-sticky panel (no GSAP pin, so nothing on the page moves when the motion code arrives). It sticks only on screens at least 560px tall, and its copy scales with the screen height so it always fits.
  - The hero's report chips share the space between the navigation and the headline and drop out one by one when that space runs short, so they never cover the text.
  - The Problem column only sticks on screens at least 820px tall; the Why photo is capped to the screen height.
  - Space between sections scales with the screen height (`section-y-*` in `app/globals.css`): identical on normal screens, tighter on short ones, so a gap never fills most of the screen.
  - Checked with real wheel scrolling (dev and production builds) at 1280×577, 1366×657, 1536×730, 1440×900, 1920×969, 1024×600, 1180×820, 768×1024, 390×664, 360×640, 844×390 and 932×430.
- **Photos are fitted, never force-cropped.** The generated photos came in mixed shapes (16:9, 2:1, 4:5), so the export script keeps each whole photo and only extends a backdrop where a slot needs room. The hero is art-directed by shape: the wide shot on landscape screens from 768px, the portrait shot on phones and portrait tablets.
- **The share card is a JPEG (about 95 KB).** With a real photo the generated PNG was about 800 KB, and WhatsApp skips link-preview images much over 300 KB. It's still rendered from code at build time.
- **One booking label everywhere:** "Book your PDI" (the brief suggested "Book PDI" for the nav).
- **Testimonials** are visible with obvious "Placeholder" tags so the client sees the design. Switch them off with `testimonials.enabled`.
- **Cursor follower:** contextual, desktop mouse only, never replaces the system cursor, off under reduced motion, and can be switched off.
- **Typography:** Cormorant Garamond for display (Instrument Serif and Fraunces are banned by the taste rules used), Geist for UI, Geist Mono for inspection readouts.
- **Colour:** the client's navy and royal blue on cream, sampled from the Instagram logo. The yellow is used once, as the highlighter on the sample report; WhatsApp green only on WhatsApp elements.
- **The `<title>`** keeps the exact wording from the brief, including its dash. Visible page copy uses no em-dashes.

---

## Performance and accessibility

- Static page (`ensureStatic = "navigation"`), served from the CDN. No third-party scripts.
- Images go through `next/image` with exact `sizes`, AVIF/WebP and blur placeholders; only the hero is high priority (art-directed `<picture>` for phone and desktop).
- Fonts are self-hosted via `next/font`; Cormorant uses its static 500 weight.
- Only `transform`/`opacity` animate (plus a one-off mask on the hero veil). There's one sticky scroll scene (CSS `position: sticky`, so the layout never shifts when motion loads), and no WebGL.
- **`prefers-reduced-motion`:** no intro, veil, sticky scroll scene, parallax, Lenis or cursor; everything is visible and the marquee becomes a static list.
- **`prefers-reduced-transparency`:** glass surfaces turn solid.
- **Accessibility:**
  - Skip link, landmarks, one `h1`, visible focus rings, 44px touch targets and AA contrast.
  - Mobile menu: `aria-expanded`, dialog semantics, the background set `inert`, Esc to close, focus returned to the toggle.
  - The marquee has a pause button; the rails have previous/next buttons.
- **SEO:** metadata API (title, description, canonical, Open Graph / Twitter with a generated share image), `robots.txt`, `sitemap.xml`, web manifest, favicons, and AutomotiveBusiness + FAQPage JSON-LD.

To re-check: `npm run build && npm run start`, then run Lighthouse (mobile) against `http://localhost:3000`. Scores were measured with the placeholder images; real photos add some weight to the hero, so keep exporting them through `npm run images`.

---

## Deploy on Vercel

1. In Vercel, **Add New → Project** and import `github.com/kumbharkunal/AUTOLENSAC`.
2. The framework (Next.js) is detected automatically. Keep the default build settings. **No environment variables are needed.**
3. Deploy. Every push to `main` redeploys.
4. When the client's domain is ready, add it under **Settings → Domains** and set `siteUrl` in `content/site.ts`. Canonical URLs, the sitemap and share cards already use Vercel's production URL automatically.

---

## Project map

```
app/                 layout (fonts, metadata, boot script), page, globals.css (design tokens),
                     icons, share image, robots, sitemap, manifest, 404
components/brand/    Logo, LensMark, official social icons (one SVG sprite)
components/layout/   Navbar, MobileMenu (Motion), Footer, FloatingWhatsApp
components/motion/   MotionRoot (unlock switch, reveals), MotionEngine (Lenis + GSAP),
                     scenes.tsx (wrappers) + scene-effects.tsx (GSAP choreography), CursorLens
components/sections/ Hero, Statement, ModelsMarquee, Problem, Services, under-the-lens/,
                     Process, ReportPreview, WhyAutoLens, Testimonials, InstagramStrip, Faq, FinalCta
content/             site.ts (all copy), images.ts (static image imports)
lib/                 gsap registration, motion scheduler/stores, links, JSON-LD
scripts/             image specs, optimize-images, placeholders, icons
research/            client brief, design rules
.claude/skills/      design and GSAP skills used for this build
```

## Credits

- Fonts: Cormorant Garamond (Christian Thalmann) and Geist / Geist Mono (Vercel), SIL Open Font License 1.1.
- Icons: [Phosphor](https://phosphoricons.com) (MIT). Brand glyphs from [Simple Icons](https://simpleicons.org) (CC0), shown in their official colours.
- Motion libraries: [GSAP](https://gsap.com) (free standard license), [Lenis](https://lenis.darkroom.engineering) (MIT), [Motion](https://motion.dev) (MIT).
