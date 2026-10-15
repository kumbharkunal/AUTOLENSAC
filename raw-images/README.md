# raw-images

Drop the PNGs you generate with ChatGPT here, using these exact names (prompts in `../IMAGE_PROMPTS.md`):

| File | ChatGPT size | Becomes |
|---|---|---|
| `hero-desktop.png` | 1536×1024 | `public/images/hero-desktop.webp/.avif` |
| `hero-mobile.png` | 1024×1536 | `public/images/hero-mobile.webp/.avif` |
| `lens-car.png` | 1536×1024 | `public/images/lens-car.webp/.avif` |
| `diagnostic-tablet.png` | 1536×1024 | `public/images/diagnostic-tablet.webp/.avif` |
| `paint-gauge.png` | 1024×1536 | `public/images/paint-gauge.webp/.avif` (cropped to 4:5) |
| `handover.png` | 1024×1536 | `public/images/handover.webp/.avif` (cropped to 4:5) |
| `bike-inspection.png` | 1024×1024 | `public/images/bike-inspection.webp/.avif` |
| `lens-bike.png` | 1536×1024 | `public/images/lens-bike.webp/.avif` |
| `og-photo.png` | 1536×1024 | `public/images/og-photo.jpg/.webp/.avif` (cropped to 1200×630) |
| `detail-vin-tyre.png` | 1024×1024 | `public/images/detail-vin-tyre.webp/.avif` |
| `cta-bg.png` | 1536×1024 | `public/images/cta-bg.webp/.avif` |

Then run `npm run images` (or `npm run images -- hero-desktop hero-mobile` for just some), commit `public/images` and redeploy.

The PNGs in this folder are ignored by git on purpose; only the optimized files are committed.
