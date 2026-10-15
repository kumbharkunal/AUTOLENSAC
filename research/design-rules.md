# AutoLens: Design Rules

The working design system for the AutoLens site (a DESIGN.md in all but name). Code must follow it; where code and this file disagree, fix one of them.

---

## 1. Direction

**Design read:** a premium-consumer service landing page for Indian new-vehicle buyers (cars and two-wheelers) who worry about being cheated at delivery. Editorial, luxury-automotive language (car magazine × watchmaker) in a light, warm cream theme. Built with Next.js, Tailwind v4 tokens, Cormorant Garamond + Geist, GSAP scroll choreography and Motion micro-interactions.

**Dials** (tasteskill): `DESIGN_VARIANCE 7 · MOTION_INTENSITY 7 · VISUAL_DENSITY 3`.

### Why "the Lens"
The brand is literally a lens, and its promise is clarity: seeing what a showroom shine hides. So the page behaves like an optical instrument:
- **Focus:** things arrive slightly out of focus and resolve into crisp clarity. The hero racks into focus through an aperture; the statement sharpens word by word as you scroll.
- **Scrutiny:** the "Under the lens" section moves a real magnifying loupe across a vehicle, checkpoint by checkpoint.
- **Precision:** mono readouts, dotted leaders, hairlines, and a report that reads like a calibration certificate.
- **Trust:** calm typography, generous space and plain language. Competitors shout; AutoLens explains.

The existing navy and royal blue stay instantly recognisable. Placed on warm cream paper with an editorial serif, they move from "busy flyer" to "trusted specialist". The pairing is the tasteskill "Cobalt + Cream" family, and Oura's "cream paper, editorial serif, one action blue" shows it works for premium products.

---

## 2. Sources studied and what was taken

| Source | Taken |
|---|---|
| tasteskill (`design-taste-frontend`, `high-end-visual-design`) | Design read and dials. Zero em-dashes. Eyebrow budget (≤ 1 per 3 sections). No layout family repeated. No 3-equal-card rows. Hero discipline (≤ 4 text elements). One accent, one radius system. Double-bezel cards. Button-in-button CTAs. Motion must be motivated. Pre-flight checklist. |
| ui-ux-pro-max | Accessibility and touch priorities (AA contrast, 44 px targets, focus rings, reduced motion, pause controls for moving content). Phosphor as the icon default. Spacing rhythm. Font data used to check Cormorant Garamond / Geist axes. |
| xiaopu-ai web-design | DESIGN.md structure. "3 wow moments + 1 clever detail" for landing pages. Performance red lines: ≤ 1 WebGL scene, ≤ 2 pins, no animated `filter: blur()`, small backdrop blur only on fixed UI. |
| greensock gsap-skills | `useGSAP` with scope and cleanup. `contextSafe`. `gsap.matchMedia()` for breakpoints and reduced motion. ScrollTrigger only on top-level tweens/timelines. Create triggers top to bottom (or sort + refresh). SplitText `autoSplit` + `onSplit`. `quickTo` for pointer followers. Transform/opacity only. |
| awesome-design-md / getdesign.md | **Tesla:** radical subtraction, cinematic photography, a single blue for primary CTAs, frosted nav. **Ferrari:** editorial sparseness, accent used surgically. **Oura:** cream paper + editorial serif + quiet grotesque + one action blue. |
| 21st.dev, motionsites.ai, Awwwards/Godly automotive and luxury sites | Pattern vocabulary only (magnetic CTA, masked line reveals, loupe/magnifier, sticky editorial split, marquee). Adapted, not copied. |

### Conflicts between the brief and the skills, resolved
- **Serif:** tasteskill bans Instrument Serif and Fraunces as defaults, so the site uses **Cormorant Garamond**. It's on the client brief's list and in the skill's approved rotation, and is justified by the editorial/luxury direction.
- **Cream background:** tasteskill bans default warm-paper palettes, but the override applies because the brief names these exact colours. No brass, ochre or oxblood is used.
- **Custom cursor:** tasteskill advises against it, but the brief asks for a follower. It's contextual: desktop fine-pointer only, the native cursor stays, it's off under reduced motion, and `features.cursor` can switch it off.
- **Dark mode:** not required by the brief. One deliberate navy surface only: the final CTA "plate".

---

## 3. Colour tokens

Defined in `app/globals.css` under `@theme`, and used through Tailwind utilities (`bg-cream`, `text-ink`, …). No raw hex values in components.

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `cream` | `#F4EDE2` | Page background | — |
| `ivory` | `#FBF8F2` | Raised surfaces, paper, glass fill | — |
| `sand` | `#E6DCCB` | Hairlines, tinted panels | — |
| `ink` | `#121A36` | Headlines and body | ≈ 14.7:1 on cream |
| `muted` | `#5F6478` | Secondary text | 5.0:1 cream, 5.5:1 ivory |
| `navy` | `#0B1438` | Logo "Auto", CTA plate | — |
| `lens` | `#1A47D1` | The one accent: CTAs, links, active states, lens motif | 6.3:1 on cream; ivory on lens 6.9:1 |
| `lens-deep` | `#1338B0` | Hover / pressed accent | — |
| `lens-tint` | `#9DB1F2` | Accent on the navy plate | ≈ 8.5:1 on navy |
| `signal` | `#F2C230` | One decorative use: the highlighter stroke in the report | decorative only |
| `wa` | `#25D366` | WhatsApp elements only | glyph/graphic only |

Rules:
- One accent (lens blue). On navy, use `lens-tint` (same hue family).
- Accent words in headlines are *italic + lens blue*, at most 4 on the page.
- WhatsApp green appears only on WhatsApp glyphs and badges, never as a text colour or large surface.
- Shadows are navy-tinted (`rgb(18 26 54 / x)`), never black.

---

## 4. Typography

| Role | Font | Size (fluid) | Weight | Leading | Tracking |
|---|---|---|---|---|---|
| Hero H1 | Cormorant Garamond | ≈ 42 → 100 px (authored lines per breakpoint) | 500 | 1.02 | −0.02em |
| Statement | Cormorant Garamond | ≈ 48 → 136 px | 500 | 1.0 | −0.025em |
| Section H2 | Cormorant Garamond | `clamp(2.25rem, 1.4rem + 3.4vw, 4.75rem)` | 500 | 1.04 | −0.02em |
| H3 | Cormorant Garamond | `clamp(1.5rem, 1.25rem + 0.9vw, 2.125rem)` | 600 | 1.1 | −0.01em |
| Body | Geist | 16–18 px | 400 | 1.6 | 0 |
| UI / buttons | Geist | 15–16 px | 500 | 1 | 0 |
| Label / eyebrow / readout | Geist Mono | 11.5–13 px, uppercase | 500 | 1.2 | 0.14em |

- All fonts come from `next/font/google`: self-hosted, variable, latin subset, `display: swap`. Geist Mono isn't preloaded.
- **Italic descender clearance:** italic display words with descenders (`p g y j q`) get leading ≥ 1.05 and bottom padding on their mask.
- Body copy maxes out at 65ch. Indian English spelling (tyre, kilometres); "computerized" as the client writes it.
- **No em-dashes or en-dashes in visible copy.** Readouts use dotted leaders: `ENGINE STATUS ······ GOOD`.

---

## 5. Shape, depth, surfaces

- **Radius lock:** pills (`9999px`) for buttons, chips, nav, toggles and tags · `28px` for cards · `36px` desktop / `24px` mobile for plates (hero frame, report shell, CTA plate, lens stage).
- **Double-bezel:** major containers sit in an outer shell (`sand/60`, hairline, `p-1.5`) holding an inner core with a concentric radius (outer minus padding).
- **Shadows:** `sm 0 1px 2px rgb(18 26 54/.06)` · `md 0 12px 32px -16px rgb(18 26 54/.28)` · `lg 0 40px 80px -32px rgb(18 26 54/.35)`.
- **Glass** (nav pill, hero chips): `ivory @ 72%` + `backdrop-filter: blur(14px) saturate(1.4)` + 1 px `ink/8%` hairline + inset top highlight. Solid ivory under `prefers-reduced-transparency`. Hero chips only blur at ≥ 768 px.
- **Grain:** a static SVG-noise texture on one fixed, `pointer-events-none` layer at about 4% opacity. No blend modes, never on scrolling containers.
- **Hairlines:** `ink/10%` on cream, `ink/8%` on ivory. Avoid borders on every row of a list.

---

## 6. Layout

- Container: `max-w-[1360px]`, gutters 16 px (< 640) · 24 px (sm) · 32 px (md) · 48 px (lg+).
- Section rhythm: `py-24 sm:py-32 lg:py-40`.
- Breakpoints: Tailwind defaults (640 / 768 / 1024 / 1280 / 1536). Tested at 360, 390, 430, 768, 1024, 1440, 1920.
- Hero: `min-h-[100svh]` (the stable small-viewport unit, so no jumps as mobile browser bars collapse).
- Every multi-column layout declares its below-768 px single-column fallback in the same component.
- **Layout families, one per section:** framed photo plate (hero) · centred manifesto (statement) · strip (marquee) · sticky editorial split (problem) · bento (services) · pinned stage (under the lens) · horizontal timeline (process) · document (report) · editorial index (why) · rail (testimonials) · feed grid (Instagram) · sticky accordion (FAQ) · navy plate (final CTA).
- **Eyebrows (4 in total):** hero, "What we check", "Vehicle Health Report", "@autolensac".

---

## 7. Components

- **Primary button:** lens-blue pill, ivory label, 52 px tall (48 px compact). Button-in-button trailing badge: a WhatsApp green disc for WhatsApp CTAs, otherwise an ivory/15 disc with an arrow. Hover: background shifts to `lens-deep`, the badge nudges up-right. Active: `scale(.98)`. Focus: 2 px lens ring with a 2 px cream offset.
- **Secondary button:** transparent pill, 1 px `ink/20` border, ink label. Hover: `ink/5` fill.
- **On navy:** primary becomes an ivory pill with ink label; secondary becomes an `ivory/30` outline. Focus ring is ivory.
- **Single CTA label:** every booking CTA reads **"Book your PDI"**. Calls read "Call 88057 74390" (desktop) or "Call" (compact).
- **Status pill:** lens tint background (`lens/8%`), lens text, check glyph. Labels: Good / Clear / Verified / Checked.
- **Report chip** (hero): glass pill, mono uppercase, a small lens-blue status dot (semantic: "checked").
- **Icons:** Phosphor only. `light` weight for feature icons ≥ 24 px, `regular` for small controls. Decorative icons are `aria-hidden`.
- **Social logos:** official glyphs from Simple Icons, inline SVG. Instagram uses its radial brand gradient, Facebook `#0866FF`, WhatsApp `#25D366`.
- **LensMark:** the logo's magnifier "o", reused for the intro, cursor, eyebrow marker, marquee separators, process nodes, report seals and favicon.

---

## 8. Motion

**Philosophy:** motion explains focus. Every animation answers "what does this help the visitor notice?" Only `transform` and `opacity` animate, except the hero aperture mask (a one-off CSS custom-property animation) and the FAQ height.

**Tokens:** durations 200 / 350 / 600 / 900 ms · `--ease-out: cubic-bezier(.16,1,.3,1)` · `--ease-lens: cubic-bezier(.7,0,.2,1)` · springs `stiffness 380, damping 34`.

| Moment | Library | Trigger | Effect | Reduced motion |
|---|---|---|---|---|
| Intro (first visit per session) | CSS | page load | lens mark focus-pull at the hero focal point, then hands off to the aperture (≤ 1.1 s, skippable) | skipped |
| Hero | CSS + GSAP | load / scroll | aperture veil opens (compositor-only scale), image settles 1.08 → 1, masked line rise, chips spring in and float, scrubbed parallax | static, no veil |
| Navbar | CSS transitions + scroll store | scroll direction | hide on scroll down, show on scroll up, shrink after hero, active indicator slides | instant |
| Section H2s | GSAP SplitText (`lines`, `mask`, `autoSplit`) | enter | lines rise 0.9 s, 80 ms stagger | static |
| Statement | GSAP SplitText (`words`) | scrub | words sharpen from soft grey (AA) to ink | full ink |
| Models marquee | CSS | perpetual | 60 s loop; pause button; paused offscreen | static wrapped list |
| Reveals (problem, services, why, Instagram) | CSS + shared IntersectionObserver | enter | fade up 24 px, staggered | visible |
| Under the lens | GSAP pin + scrub (≥ 1024 px) / state (mobile) | scroll / swipe / click | loupe travels between hotspots, list highlights, final "ready" seal | click-select, no pin |
| Process | GSAP scrub | scroll | line draws, nodes focus | full line |
| Report | GSAP timeline (once) | enter | scan sweep, rows print, checks draw, highlighter wipes | static |
| FAQ | CSS (grid-rows) | click | height + opacity | instant |
| Final CTA | GSAP scrub | scroll | aperture rings scale | static |
| WhatsApp FAB | CSS (spring easing) | after hero | spring in | instant |
| Mobile menu | Motion (AnimatePresence) | tap | sheet springs in, links stagger, backdrop fades | instant |
| Cursor lens | GSAP `quickTo` | pointer (fine, hover) | ring follows, grows over interactive targets | off |

**Engineering rules**
- **Motion stays off the critical path.** The hero (intro, aperture veil, line reveals, chips) is pure CSS, so it plays before any JavaScript arrives. Everything else waits for a "motion ready" switch (`lib/motion/ready.ts`), which flips on the first input (pointer, scroll, key, touch) or 2.5s after the page has loaded. Only then are these mounted, as code-split `next/dynamic` components:
  - Lenis, GSAP, ScrollTrigger and the cursor lens (`components/motion/MotionEngine.tsx`)
  - the scroll scenes (`components/motion/scene-effects.tsx`)
  - the inspector's pin (`InspectorPin.tsx`)
  - the Motion mobile menu (`components/layout/MobileMenu.tsx`)
- Lenis (`autoRaf: false`) is driven by `gsap.ticker`; `lenis.on('scroll', ScrollTrigger.update)`, `lagSmoothing(0)`. Touch keeps native scrolling (`syncTouch: false`). Lenis isn't created under reduced motion, and it stops while the mobile menu is open.
- GSAP plugins are registered once in `lib/gsap.ts`. Every scene uses `useGSAP({ scope })` with `contextSafe`, gated by `gsap.matchMedia()`.
- Section setups run through `lib/motion/scheduler.ts`: queued in page order, run in idle time, then `ScrollTrigger.sort()` + `refresh()`. They refresh again after fonts load.
- `ScrollTrigger.config({ ignoreMobileResize: true })`. No markers in production. The navbar reads scroll position from the engine (`lib/motion/scroll-store.ts`); there are no raw scroll listeners.
- **Motion vs CSS.** Motion (`motion/react`) powers the mobile menu sheet: AnimatePresence, spring physics, staggered links. Simple state changes use CSS transitions with the same easing tokens: navbar hide/shrink, hamburger morph, FAQ height, WhatsApp button. GSAP and Motion never animate the same element.
- Budgets: 1 pinned section, 0 WebGL scenes, no animated `filter`, `will-change` only on the veil and loupe.
- **Measured:** Lighthouse mobile (placeholder images) gave Performance 91, Accessibility 100, Best Practices 100, SEO 100. CLS 0.002, TBT ≤ 80ms.

**The 3 wow moments + 1 clever detail**
1. Hero lens-focus reveal.
2. Statement focus-pull on first scroll.
3. "Under the lens" loupe inspection (plus the services bento).
- Clever detail: a yellow highlighter swipes across "ready for delivery" on the sample report.

---

## 9. Accessibility and performance

- WCAG AA contrast on all text (table above). Visible focus on every interactive element. Skip link. One `h1`, one `h2` per section, landmarks, `lang="en-IN"`.
- 44 px minimum touch targets. Mobile menu: `aria-expanded` / `aria-controls`, dialog semantics, background set `inert`, Esc closes, focus returns to the toggle.
- Moving content: marquee has a pause control (WCAG 2.2.2). Rails have previous/next buttons. Nothing flashes.
- `prefers-reduced-motion`: no Lenis, no pin, no parallax, no intro, no cursor; content fully visible. `prefers-reduced-transparency`: solid surfaces.
- Images: `next/image` / `getImageProps`, static imports (hashed URLs, automatic blur placeholders), exact `sizes`, AVIF/WebP. Only the hero is high priority.
- Budgets: first-load JS ≤ ~180 KB gz, LCP < 2.5 s, CLS < 0.05, no third-party scripts, Lighthouse mobile ≥ 90 / ≥ 95 / ≥ 95 / ≥ 95.

---

## 10. Do / Don't

**Do**
- Let photography carry the emotion; let type carry the authority.
- Keep one accent colour and one radius system everywhere.
- Write plain-language copy with one idea per sentence.
- Flag every unconfirmed fact as a TODO in `content/site.ts`.
- Test every change at 360 px and with reduced motion.

**Don't**
- ❌ Em-dashes or en-dashes in visible copy.
- ❌ Fake reviews, fake counters, invented prices, point counts or durations.
- ❌ Car-maker logos or badges (model names as plain text only).
- ❌ More than one marquee, more than one pinned section, any WebGL.
- ❌ Equal three-card rows, list rows with a border on every line, scroll cues, section-number eyebrows.
- ❌ Pills or captions overlaid on photos (except the semantic hero report chips).
- ❌ Animating `top/left/width/height` or `filter`, or raw `window` scroll listeners.
- ❌ WhatsApp green outside WhatsApp elements; yellow anywhere except the report highlighter.
- ❌ Pure black or pure white surfaces; black drop shadows.
- ❌ Generic icon sets, emoji as icons, hand-drawn icon paths (social logos come from Simple Icons).
