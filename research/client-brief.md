# AutoLens: Client Brief

Research date: 14–15 October 2026. Sources: the client's own Instagram post (supplied in the project brief), the public Instagram profile, and web checks listed below.

Legend: **Confirmed** = stated by the client or visible on their own channel. **Found** = discovered during research. **Missing** = not found anywhere; flagged `// TODO: confirm with client` in `content/site.ts`.

---

## 1. Identity

| Item | Value | Status |
|---|---|---|
| Brand name | **AutoLens** (one word) | Confirmed (brief). Note: the Instagram display name is "Auto Lens" with a space; ask the client which form is official. |
| Instagram | [@autolensac](https://www.instagram.com/autolensac/) | Confirmed |
| Instagram bio | "🚗 Vehicle Consultancy \| 🔍 Expert PDI Services / Helping you buy the right car with confidence & clarity." | Found |
| Positioning line | "Helping you buy the right car with confidence & clarity." | Found (bio). Adapted on the site to "vehicle" because they inspect bikes too. |
| Category | Vehicle consultancy, expert Pre-Delivery Inspection (PDI) services | Confirmed |
| What "AC" in the handle means | Unknown (possibly "Auto Consultancy") | **Missing** |
| Audience size (Oct 2026) | 20 followers, 2 following, 5 posts, reels present, public account | Found |
| Location on profile | None set | Found (empty) |
| Link in bio | None | Found (empty) |

## 2. Logo and colour

- The Instagram profile picture is the logo: wordmark "AutoLens" with **"Auto" in deep navy** and **"Lens" in royal blue**. The "o" in "Auto" is drawn as a **magnifying glass with a blue centre** and a short handle. Sub-line: **"PRE-DELIVERY INSPECTION | CONSULTATION"** in grey small caps between thin rules, on a white disc with a navy ring.
- Colours sampled from the 150 px profile JPEG (approximate, lossy source):
  - Navy ("Auto"): ≈ `#0A1240` (site token `navy` `#0B1438`, text token `ink` `#121A36`)
  - Royal blue ("Lens"): ≈ `#1240C4`–`#1A47D1` (site token `lens` `#1A47D1`)
  - Sub-line grey: ≈ `#7C7F8E` (site token `muted` `#5F6478`, darkened for AA contrast)
- Their flyers also use a **yellow highlight** and **WhatsApp green**.
- **Missing:** an official vector logo (SVG/AI/PDF). The site uses a faithful inline SVG recreation marked `// TODO: replace with official logo file`.

## 3. Contact

| Item | Value | Status |
|---|---|---|
| Phone | +91 88057 74390 | Confirmed |
| WhatsApp | `wa.me/918805774390` (assumed same number) | **Missing**: confirm the WhatsApp number |
| Email | — | **Missing** |
| Address / office | — | **Missing** (inspections happen at the dealership) |
| City / service areas | — | **Missing** (the brief hints at Maharashtra; not confirmed) |
| Business hours | — | **Missing** |
| Facebook / YouTube / Google Business / Justdial / LinkedIn / X | — | **Missing** (none found) |

## 4. Services (all confirmed from their post)

Core message: **"Don't buy a vehicle without PDI!"**

Services:
1. Engine & battery health check
2. Accident & paint inspection
3. Odometer & electrical scan
4. Save money from hidden problems
5. Professional vehicle consultation

PDI checklist: exterior & paint inspection · interior quality check · electrical systems testing · fluid level verification · tyre & wheel inspection · road-readiness assessment.

Vehicle Health Report items: Engine status · Battery health · Electrical system · Accident check · Odometer verification. Badges: 100% computerized · Detailed analysis · Accurate reports · Trusted service.

Trust pillars: 100% computerized diagnosis · Expert & certified technicians · Detailed & accurate reports · Safe & smart buying decisions.

Vehicles: "all major cars & bikes". Their examples: MG ZS EV, MG Gloster, Hyundai Venue, Tata Nexon, VW Taigun, Skoda Slavia, TVS Jupiter, Honda Activa, Bajaj Pulser.

Their own lines (used, lightly polished, on the site):
- "Before the keys are handed over, perfection comes first."
- "Expert computerized car & bike diagnosis before delivery."
- "Every vehicle deserves a thorough Pre-Delivery Inspection (PDI) to ensure safety, performance, and peace of mind from day one."
- "Because every detail matters when delivering a vehicle that's ready for the road."
- "For a worry-free drive, trust AutoLens."
- "Book your PDI today."

Instagram content themes: PDI awareness, automotive insights, vehicle care tips, industry updates.

## 5. Still missing (ask the client)

1. City and service areas (and whether they travel to other cities)
2. Official vector logo; confirm "AutoLens" vs "Auto Lens"
3. WhatsApp number (assumed +91 88057 74390)
4. Email address
5. Business hours
6. Facebook, YouTube, Google Business Profile links (if any)
7. Pricing (per car / per bike, any packages)
8. Typical inspection duration
9. Report format and delivery (PDF? WhatsApp? same day? photos included?)
10. Years in business and number of inspections done (needed before any counters are shown)
11. Real customer reviews (with permission to publish names)
12. What "AC" in @autolensac stands for
13. What "certified technicians" refers to (which certification)
14. Bike-specific checklist (the site adapts the car checklist)
15. Production domain name
16. Are they independent of dealerships? (a strong selling point if true; not claimed on the site)

## 6. Research log (what was checked)

- **Instagram:** profile JSON and meta tags were readable through crawler user-agents. Post captions and highlights need a login, so they weren't captured.
- **Web search and fetch tools:** unavailable during research (tool error). The browser extension wasn't connected. All checks were read-only HTTP requests.
- **Domains:** `autolensac.com` and `autolensac.in` don't resolve. `autolens.in` belongs to an unrelated party.
- **YouTube** `@autolensac` → 404. **Linktree** → 404. **Facebook** → blocked to automated requests (inconclusive). **Threads** → login wall.
- **Bing:** no results for `"autolensac"`, `"8805774390"`, `"88057 74390"`, `"Auto Lens" PDI` or `"AutoLens" "Vehicle Consultancy"`. DuckDuckGo showed a bot challenge, so I stopped using it.
- **Conclusion:** the brand has no web presence beyond Instagram. This site would be its first.

## 7. Competitor study (vocabulary and customer fears only)

Studied: **PDICars** (pdicars.com), **PehliCar** (Delhi NCR), **Cars24 New Car PDI**, **Nxcar**, **CheckMyCars** (strong in Mumbai/Pune/Aurangabad and other Maharashtra cities), **CarVaidya** (Bangalore), **PDI Boss**.

**Service vocabulary in the market:** paint thickness gauge / paint micron check, OBD-II fault scan, ODO tamper detection, VIN decoding (RTO Form 20/21/22 guidance), demo-car usage detection, swapped-battery checks, factory seal and part authenticity, transit damage, software and sensor audit, "155 / 280 / 300 / 500-point" checklists, same-day digital reports with photos, dealer negotiation help.

**Customer fears they speak to:**
- Hidden transit damage (scratches, dents, chips)
- Repainted or filled panels
- Old stock: manufacturing month older than promised
- VIN or engine number mismatch with the paperwork
- Odometer rollback or demo use on a "new" vehicle
- Electrical faults, weak or swapped batteries
- Missing accessories that are billed on the invoice
- Signing the delivery note before checking, then being stuck with repairs

**How they present themselves:** fear-led headlines ("Your dealer is hiding defects"), urgency discounts (75% off banners), emoji, long city lists, affiliate product links, many colours and stock icons. Functional, but none of them look premium.

**AutoLens positioning on this site:** the calm, expert, premium choice. Quiet confidence instead of fear, plain-language reports, editorial photography, a single accent colour, and the "lens" idea of clarity and focus. No point-count, "independent" or price claims until the client confirms them.

## 8. Tone notes

- Reassuring, precise, never alarmist. Explain the risk once, then show the remedy.
- Indian English spellings (tyre, kilometres), with "computerized" kept as the client writes it.
- Short sentences. No jargon without explanation.
- Address the buyer directly ("before you sign", "your report").
