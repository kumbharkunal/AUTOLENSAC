# raw-images

Drop the images you generate here, using these exact names (prompts in `../IMAGE_PROMPTS.md`).
PNG, JPG or WebP all work, at any size or shape: the script fits each one to its slot.

| File | Suggested size | What the script does |
|---|---|---|
| `hero-desktop.png` | 1536×1024 or 16:9 | Keeps the whole photo and adds soft ceiling and window light on the left, so the subject sits right of the headline (landscape screens) |
| `hero-mobile.png` | 1024×1536 or 9:16 | Keeps the whole photo (phones and portrait tablets) |
| `lens-car.png` | 1536×1024 or wider | Fits it into the 3:2 "Under the lens" stage and extends the studio backdrop |
| `lens-bike.png` | 1536×1024 or wider | Same as the car |
| `diagnostic-tablet.png` | 1536×1024 | Keeps the whole photo |
| `paint-gauge.png` | 1024×1536 | Keeps the whole photo |
| `handover.png` | 1024×1536 | Keeps the whole photo |
| `bike-inspection.png` | 1024×1024 | Keeps the whole photo |
| `detail-vin-tyre.png` | 1024×1024 | Keeps the whole photo |
| `cta-bg.png` | 1536×1024 | Keeps the whole photo |
| `og-photo.png` | 1536×1024 or 2:1 | Crops to 1200×630 from the left (keep the subject on the right) |

Then run `npm run images` (or `npm run images -- hero-desktop hero-mobile` for just some), commit `public/images` and redeploy.
If you replace `lens-car` or `lens-bike`, re-check the hotspot positions (README, "Calibrate the hotspots").

The images in this folder are ignored by git on purpose; only the optimized files are committed.
