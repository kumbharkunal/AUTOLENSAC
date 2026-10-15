# AutoLens: image prompts for ChatGPT

Eleven photographs, listed in **priority order** (the first three carry most of the page).

## How to use this file

1. Open a **new** ChatGPT chat for each image and paste the whole prompt block. Every prompt is self-contained.
2. Ask for the exact size listed (ChatGPT's native sizes: 1536×1024 landscape, 1024×1536 portrait, 1024×1024 square).
3. Download the result as **PNG** and save it in `/raw-images` with the exact file name shown (e.g. `raw-images/hero-desktop.png`).
4. Run `npm run images`. The script crops and resizes to the final size and writes **WebP + AVIF** into `/public/images` (and a JPEG for the share image).
5. Commit and redeploy. For the two "Under the lens" photos, check the hotspot positions afterwards (see README, "Calibrating hotspots").

If a result has text, logos, odd hands or extra wheels, regenerate. Don't fix it in post.

Palette used in every prompt: cream `#F4EDE2`, ivory `#FBF8F2`, sand `#E6DCCB`, deep navy `#0B1438`, ink navy `#121A36`, royal blue `#1A47D1`.

---

## 1. Hero, desktop

- **File:** `raw-images/hero-desktop.png` → `public/images/hero-desktop.webp` / `.avif`
- **ChatGPT size:** 1536×1024 (3:2 landscape). **Final export:** 1536×1024 (no crop). Shown full-bleed in a rounded frame on screens 768px and wider, cropped slightly at the top and bottom.
- **Download:** PNG. **Final:** WebP + AVIF (via `npm run images`).
- **Variant:** desktop only. The phone version is image 2.

```
Create a photorealistic, high-end automotive editorial photograph for the homepage hero of AutoLens, a premium pre-delivery inspection (PDI) and vehicle consultancy for new cars and bikes in India.

Scene: a bright, warm, modern car dealership delivery bay. A brand-new compact SUV in a soft pearl white or light silver colour is parked in three-quarter front view, facing slightly to the left. An Indian automotive inspector (adult man, neat short hair, calm and focused expression) stands beside the front wheel, holding a slim diagnostic tablet and looking at the car's headlight and front bumper. He wears a plain deep-navy polo shirt (#0B1438) with absolutely no text, logo or badge, dark trousers and clean sneakers.

Composition (very important, text will be placed over the image):
- The SUV and the inspector sit in the upper-middle and right of the frame: the car spans roughly from 42% to 95% of the width and from 18% to 62% of the height. The inspector stands just left of the car's front, around 32% to 42% across.
- The bottom 35% of the image must be clean, bright, softly reflective floor (light polished concrete or pale stone) with nothing on it: a large headline, a paragraph and buttons will sit there.
- The top 12% must be calm, bright wall or ceiling (a navigation bar overlays it).
- The far left 30% should be calm: a bright wall or large window with soft daylight.
- The car's front, around 70% across and 40% down, is the focal point and must be in sharp focus.

Light and colour: soft, warm late-morning daylight from large windows on the left, gentle diffused shadows, a creamy light palette dominated by cream (#F4EDE2), ivory (#FBF8F2) and sand (#E6DCCB) surfaces, with deep navy (#0B1438) only in the inspector's polo and a single subtle royal-blue (#1A47D1) accent at most (for example a tiny status light on the tablet). Calm, expensive, trustworthy mood, like a luxury watch or premium automotive magazine shoot.

Camera: full-frame camera, 50mm lens at f/2.8, eye level, natural perspective, crisp focus on the car's front and the inspector, very gentle background falloff.

Strictly avoid: any text, letters or numbers anywhere; lettering on clothing; watermarks; logos, badges, grille emblems or wheel-centre logos of any car brand; licence plates or plate numbers (the front plate area must be plain and blank or out of view); distorted hands or fingers; extra or misshapen wheels; people other than the inspector; clutter, posters, price tags, balloons; oversaturated or neon colours; harsh contrast; a dark or moody look.
```

---

## 2. Hero, mobile

- **File:** `raw-images/hero-mobile.png` → `public/images/hero-mobile.webp` / `.avif`
- **ChatGPT size:** 1024×1536 (2:3 portrait). **Final export:** 1024×1536 (no crop). Shown full-bleed on phones (under 768px wide).
- **Download:** PNG. **Final:** WebP + AVIF.
- **Variant:** mobile only (the desktop version is image 1).

```
Create a photorealistic, high-end automotive editorial photograph in tall portrait format for the mobile homepage of AutoLens, a premium pre-delivery inspection (PDI) and vehicle consultancy for new cars and bikes in India.

Scene: a bright, warm, modern car dealership delivery bay. A brand-new compact SUV in pearl white or light silver is parked in three-quarter front view. An Indian automotive inspector (adult man, neat short hair, calm and focused) stands beside the front wheel holding a slim diagnostic tablet, looking at the headlight. He wears a plain deep-navy polo shirt (#0B1438) with absolutely no text, logo or badge.

Composition (very important, text will be placed over the image):
- The SUV and the inspector sit in the upper half of the frame, roughly from 12% to 55% of the height, centred horizontally. The car may be cropped slightly at the left and right edges.
- The bottom 45% must be clean, bright, softly reflective floor (light polished concrete or pale stone) with nothing on it: a four-line headline, a sentence and two buttons will sit there.
- The top 8% must be calm, bright wall (a navigation bar overlays it).
- The car's front, about 50% across and 32% down, is the focal point and must be sharp.

Light and colour: soft, warm daylight from large windows, gentle diffused shadows, a creamy light palette of cream (#F4EDE2), ivory (#FBF8F2) and sand (#E6DCCB); deep navy (#0B1438) only in the polo; at most one tiny royal-blue (#1A47D1) accent. Calm, premium, trustworthy, editorial mood.

Camera: full-frame camera, 50mm lens at f/2.8, eye level, natural perspective, crisp focus on the car's front and the inspector.

Strictly avoid: any text, letters or numbers; lettering on clothing; watermarks; logos or badges of any car brand; licence plates or plate numbers; distorted hands; extra or misshapen wheels; other people; clutter or posters; oversaturated colours; a dark or moody look.
```

---

## 3. Under the lens: car

- **File:** `raw-images/lens-car.png` → `public/images/lens-car.webp` / `.avif`
- **ChatGPT size:** 1536×1024 (3:2). **Final export:** 1536×1024 (no crop). Shown inside a 3:2 stage. A magnifying loupe moves over it at 2.2× zoom, so it must be sharp everywhere.
- **Download:** PNG. **Final:** WebP + AVIF.
- **Hotspots** (you can fine-tune them later with `?hotspots`): rear door paint ~62%/50%, side window ~53%/43%, headlight ~17%/52%, bonnet ~28%/47%, front wheel ~27%/68%, lower door ~45%/60%.

```
Create a photorealistic studio photograph of a brand-new compact SUV for an interactive inspection feature on the website of AutoLens, a premium pre-delivery inspection (PDI) and vehicle consultancy in India.

Subject: one modern compact SUV in a soft light silver or pearl white colour, shown in an exact, flat side profile (90 degrees), facing LEFT (the front of the car on the left side of the image, the rear on the right). The car is unbranded and generic in design.

Composition (very important, the image is used for precise hotspots):
- The car is centred and fills about 76% of the image width, from about 12% to 88% across.
- Both wheels rest on the floor at about 68% of the image height; the front wheel centre is about 27% from the left, the rear wheel centre about 73% from the left.
- The roof is at about 30% of the height. Plenty of clean space above and below.
- The headlight sits around 17% across and 52% down; the side windows around 45% down.

Background: a seamless cream studio backdrop (#F4EDE2) that curves into the floor, softly lit, with a gentle, soft contact shadow under the car. No horizon line, no props.

Light: large soft studio lights, even and gentle, a subtle highlight running along the body line, true-to-life paint, crisp detail on panels, panel gaps, lights and tyres (the image is magnified 2.2× on screen, so everything must be sharp from edge to edge).

Camera: medium-format look, 85mm lens at f/11, perfectly level, no perspective distortion.

Strictly avoid: any text, letters or numbers; logos, badges or emblems on the grille, wheels or tailgate; licence plates or plate numbers; people; extra or misshapen wheels; reflections of a photographer; coloured gels; oversaturated colours; dramatic dark lighting.
```

---

## 4. Diagnostic tablet close-up

- **File:** `raw-images/diagnostic-tablet.png` → `public/images/diagnostic-tablet.webp` / `.avif`
- **ChatGPT size:** 1536×1024 (3:2). **Final export:** 1536×1024. Shown as the large photo in the "Engine & battery health check" service card, cropped to about 16:10, so keep the subject centred.
- **Download:** PNG. **Final:** WebP + AVIF.

```
Create a photorealistic, high-end editorial close-up photograph for AutoLens, a premium pre-delivery inspection (PDI) and vehicle consultancy for new cars and bikes in India. It illustrates "Engine & battery health check: computerized diagnosis".

Scene: inside a brand-new car, near the lower dashboard. A technician's hands (sleeves of a plain deep-navy polo, #0B1438, no text) hold a slim diagnostic tablet. A thin cable runs from a small OBD-II diagnostic connector plugged into the port under the dashboard to the tablet. The tablet screen shows clean, abstract diagnostic graphics only: soft gauge arcs and line charts in royal blue (#1A47D1) and white, with absolutely no readable text, numbers or brand names.

Composition: subject centred, with comfortable margins on all sides (the image is cropped to 16:10 and to a card shape). Shallow depth of field: the tablet and connector in sharp focus, the dashboard softly blurred.

Light and colour: soft, warm daylight coming through the windscreen; a creamy, light palette of cream (#F4EDE2), ivory (#FBF8F2) and sand (#E6DCCB) interior trim; deep navy only in the sleeves; royal blue only on the tablet screen. Calm, precise, premium mood.

Camera: 85mm macro-style lens at f/2.8, close but not extreme macro.

Strictly avoid: any readable text, numbers or brand names on the tablet, cable or car; car-maker logos on the steering wheel or dashboard; watermarks; distorted or extra fingers; oversaturated or neon colours; harsh shadows.
```

---

## 5. Paint-thickness gauge macro

- **File:** `raw-images/paint-gauge.png` → `public/images/paint-gauge.webp` / `.avif`
- **ChatGPT size:** 1024×1536 (2:3 portrait). **Final export:** 1024×1280 (4:5, cropped evenly top and bottom). Also shown as a wider crop in the "Accident & paint inspection" card, so keep the subject in the centre.
- **Download:** PNG. **Final:** WebP + AVIF.

```
Create a photorealistic macro photograph for AutoLens, a premium pre-delivery inspection (PDI) and vehicle consultancy for new cars and bikes in India. It illustrates "Accident & paint inspection: checking for repainted panels".

Scene: a small, modern digital paint-thickness gauge is pressed against the glossy door panel of a brand-new car painted in a deep, elegant navy-blue metallic. A technician's hand (sleeve of a plain deep-navy polo, #0B1438, no text) holds the gauge. The gauge's small screen shows a soft glowing display with abstract bars only: no readable digits, text or brand.

Composition: tall frame with the gauge and the hand in the vertical centre (the top and bottom will be cropped). The panel's reflection shows a soft, bright, cream-coloured showroom.

Light and colour: soft warm daylight, a crisp specular highlight running across the paint, a creamy light palette around the subject (cream #F4EDE2, ivory #FBF8F2), navy paint and sleeve (#0B1438) and at most a small royal-blue (#1A47D1) glow on the gauge display. Premium, precise, calm.

Camera: 100mm macro lens at f/4, shallow depth of field, sharp focus on the gauge tip touching the paint.

Strictly avoid: any readable text, numbers or brand names; car logos; watermarks; distorted or extra fingers; scratches or dents; oversaturated colours.
```

---

## 6. Handover (hands and keys)

- **File:** `raw-images/handover.png` → `public/images/handover.webp` / `.avif`
- **ChatGPT size:** 1024×1536 (2:3 portrait). **Final export:** 1024×1280 (4:5, cropped evenly). Shown as a portrait in the "Why AutoLens" section.
- **Download:** PNG. **Final:** WebP + AVIF.

```
Create a photorealistic, warm editorial photograph for AutoLens, a premium pre-delivery inspection (PDI) and vehicle consultancy for new cars and bikes in India. It illustrates the moment of a confident vehicle delivery.

Scene: hands only, no faces. One hand (with the cuff of a plain deep-navy sleeve, #0B1438, no text) passes a modern car key fob into another person's open, relaxed palm, over a light oak or pale stone table in a bright dealership lounge. The key fob is plain and unbranded.

Composition: tall frame, the two hands meeting slightly above the vertical centre, with calm space around them (the top and bottom will be cropped to 4:5). The background is softly blurred: cream walls and soft window light.

Light and colour: soft, warm window light from the left, gentle shadows, a creamy palette of cream (#F4EDE2), ivory (#FBF8F2) and sand (#E6DCCB), the navy cuff the only dark element. Natural, healthy skin tones. Calm, reassuring, premium mood.

Camera: 85mm lens at f/2, shallow depth of field, sharp focus on the key and the fingertips.

Strictly avoid: any text, letters or numbers; logos on the key fob; jewellery with logos; watermarks; distorted, extra or merged fingers; more than two hands; oversaturated colours; harsh flash.
```

---

## 7. Bike inspection

- **File:** `raw-images/bike-inspection.png` → `public/images/bike-inspection.webp` / `.avif`
- **ChatGPT size:** 1024×1024 (square). **Final export:** 1024×1024. Shown in the "Hidden-problem detection" service card (square on phones, a tall crop on desktop) and in the Instagram strip, so keep the subject centred.
- **Download:** PNG. **Final:** WebP + AVIF.

```
Create a photorealistic, high-end editorial photograph for AutoLens, a premium pre-delivery inspection (PDI) and vehicle consultancy for new cars AND bikes in India. It shows that AutoLens inspects two-wheelers too.

Scene: a bright, warm, modern showroom. A brand-new, unbranded commuter motorcycle (around 150cc, clean modern styling, soft silver or deep navy paint) stands on its side stand. An Indian technician (adult, neat, focused) kneels beside the front wheel, checking the front tyre and brake disc with a small torch, a slim tablet resting on his knee. He wears a plain deep-navy polo shirt (#0B1438) with no text, logo or badge.

Composition: square frame, technician and front half of the motorcycle in the centre with calm space around them (the image is cropped in different ways). Soft, uncluttered background.

Light and colour: soft, warm daylight, gentle shadows; a creamy light palette of cream (#F4EDE2), ivory (#FBF8F2) and sand (#E6DCCB); deep navy only in the polo (and optionally the bike's paint); at most one small royal-blue (#1A47D1) accent. Calm, premium, trustworthy mood.

Camera: 50mm lens at f/2.8, slightly low angle, sharp focus on the hands, tyre and brake.

Strictly avoid: any text, letters or numbers; logos, badges or tank decals of any motorcycle brand; licence plates or plate numbers; distorted hands; extra or misshapen wheels; other people; clutter; oversaturated colours.
```

---

## 8. Under the lens: bike

- **File:** `raw-images/lens-bike.png` → `public/images/lens-bike.webp` / `.avif`
- **ChatGPT size:** 1536×1024 (3:2). **Final export:** 1536×1024 (no crop). Shown inside a 3:2 stage with a 2.2× magnifying loupe, so it must be sharp everywhere.
- **Download:** PNG. **Final:** WebP + AVIF.
- **Hotspots** (fine-tune later with `?hotspots`): fuel tank ~47%/46%, headlight and handlebar ~36%/47%, engine ~52%/58%, front wheel ~33%/65%, rear frame ~70%/50%, rear wheel area ~60%/66%.

```
Create a photorealistic studio photograph of a brand-new motorcycle for an interactive inspection feature on the website of AutoLens, a premium pre-delivery inspection (PDI) and vehicle consultancy for cars and bikes in India.

Subject: one modern, unbranded commuter motorcycle (around 150 to 160cc street bike) in soft silver or deep navy paint, shown in an exact, flat side profile (90 degrees), facing LEFT (the front wheel on the left side of the image).

Composition (very important, the image is used for precise hotspots):
- The motorcycle is centred and spans about 56% of the image width, from about 22% to 78% across.
- Both wheels rest on the floor at about 65% of the image height; the front wheel centre is about 33% from the left, the rear wheel centre about 67% from the left.
- The fuel tank is around 47% across and 46% down; the headlight around 36% across and 47% down; the engine around 52% across and 58% down.
- Lots of clean space around the bike.

Background: a seamless cream studio backdrop (#F4EDE2) curving into the floor, softly lit, with a gentle soft contact shadow. No props.

Light: large soft studio lights, even and gentle, crisp detail on the engine, chain, brakes, tyres and tank (the image is magnified 2.2× on screen, so everything must be sharp).

Camera: 85mm lens at f/11, perfectly level, no perspective distortion.

Strictly avoid: any text, letters or numbers; logos, badges, tank decals or brand names; licence plates or plate numbers; riders or people; extra or misshapen wheels; side stand pointing towards the camera; oversaturated colours; dramatic dark lighting.
```

---

## 9. Social share image (Open Graph)

- **File:** `raw-images/og-photo.png` → `public/images/og-photo.webp` / `.avif` / `.jpg`
- **ChatGPT size:** 1536×1024 (3:2). **Final export:** 1200×630 (cropped evenly top and bottom to 1.91:1). The AutoLens logo, the headline "Don't buy a vehicle without PDI." and the phone number are added by code on the left side.
- **Download:** PNG. **Final:** JPEG (used by the share card) + WebP + AVIF.

```
Create a photorealistic, high-end automotive editorial photograph for the social media share card of AutoLens, a premium pre-delivery inspection (PDI) and vehicle consultancy for new cars and bikes in India.

Scene: a bright, warm, modern car dealership delivery bay. A brand-new compact SUV in pearl white or light silver is parked in three-quarter front view. An Indian automotive inspector in a plain deep-navy polo shirt (#0B1438, no text or logo) stands beside it, holding a slim diagnostic tablet.

Composition (very important, a logo and a large headline will cover the left side):
- The SUV and inspector occupy only the right 45% of the frame (from about 55% to 98% across), vertically centred between 25% and 75% of the height.
- The left 55% must be a clean, bright, calm cream wall and floor with nothing in it.
- The top and bottom 12% will be cropped away, so keep everything important in the middle band.

Light and colour: soft, warm daylight; a creamy light palette of cream (#F4EDE2), ivory (#FBF8F2) and sand (#E6DCCB); deep navy only in the polo; at most one tiny royal-blue (#1A47D1) accent. Calm, premium, trustworthy, editorial mood.

Camera: 50mm lens at f/2.8, eye level, crisp focus on the car and the inspector.

Strictly avoid: any text, letters or numbers; lettering on clothing; watermarks; logos or badges of any car brand; licence plates or plate numbers; distorted hands; extra or misshapen wheels; clutter; oversaturated colours.
```

---

## 10. Tyre date-code macro

- **File:** `raw-images/detail-vin-tyre.png` → `public/images/detail-vin-tyre.webp` / `.avif`
- **ChatGPT size:** 1024×1024 (square). **Final export:** 1024×1024. Shown in the "What a showroom shine can hide" section (cropped to 4:5 on desktop) and in the Instagram strip, so keep the subject centred.
- **Download:** PNG. **Final:** WebP + AVIF.

```
Create a photorealistic macro photograph for AutoLens, a premium pre-delivery inspection (PDI) and vehicle consultancy for new cars and bikes in India. It illustrates "checking the tyre's manufacturing date before delivery".

Scene: an extreme close-up of the sidewall of a brand-new car tyre on a clean alloy wheel. A technician's fingertip (sleeve of a plain deep-navy polo, #0B1438, just visible at the edge) points to a small raised rectangular date-code area moulded into the rubber. The characters in the code must be unreadable: soft, abstract raised shapes, not real letters or numbers.

Composition: square frame, the fingertip and the code area in the centre with calm space around them (the image is cropped to different shapes).

Light and colour: soft, warm, raking daylight from the side so the moulded rubber texture is beautifully visible; deep charcoal rubber against a softly blurred creamy background (cream #F4EDE2, ivory #FBF8F2), deep navy only on the sleeve. Precise, calm, premium mood.

Camera: 100mm macro lens at f/4, shallow depth of field, sharp focus on the code area.

Strictly avoid: readable text, letters, numbers or brand names on the tyre or wheel; wheel-centre logos; watermarks; distorted fingers; dirt, cracks or damage; oversaturated colours.
```

---

## 11. Final call-to-action background

- **File:** `raw-images/cta-bg.png` → `public/images/cta-bg.webp` / `.avif`
- **ChatGPT size:** 1536×1024 (3:2). **Final export:** 1536×1024. Shown at about 20% opacity behind ivory text on a deep navy panel, so it is a texture, not a hero.
- **Download:** PNG. **Final:** WebP + AVIF.

```
Create a photorealistic, atmospheric photograph for the background of the final call-to-action panel on the website of AutoLens, a premium pre-delivery inspection (PDI) and vehicle consultancy for cars and bikes in India. The image will sit at low opacity behind a large white headline and buttons.

Scene: a quiet, modern car showroom just after dusk. A brand-new SUV is softly lit from above and the side, its outline and body lines picked out by gentle reflections, while most of the frame falls into deep navy shadow. Large windows in the background glow faintly.

Composition: the car is low and slightly off-centre to the right; the centre of the frame (where the headline sits) is calm and dark with very little detail.

Light and colour: a deep navy palette (#0B1438 and #121A36) with soft royal-blue (#1A47D1) and cool ivory highlights; very low contrast, smooth gradients, no bright hotspots. Calm, premium, cinematic but gentle.

Camera: 35mm lens at f/2, soft focus fall-off.

Strictly avoid: any text, letters or numbers; logos or badges; licence plates or plate numbers; people; neon colours; harsh highlights; heavy noise.
```
