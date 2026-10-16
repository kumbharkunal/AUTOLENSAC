// Single source of truth for every photograph on the site.
// Used by scripts/optimize-images.mjs (real images) and scripts/generate-placeholders.mjs.
// `width`/`height` = final export size in /public/images. `position` = sharp crop gravity
// used when the ChatGPT export has a different aspect ratio than the final crop.

export const IMAGE_SPECS = [
  {
    name: "hero-desktop",
    width: 1536,
    height: 1024,
    position: "centre",
    usage: "Hero, screens 768px and wider",
    placeholder: "scene",
  },
  {
    name: "hero-mobile",
    width: 1024,
    height: 1536,
    position: "centre",
    usage: "Hero, screens narrower than 768px",
    placeholder: "scene-portrait",
  },
  {
    name: "lens-car",
    width: 1536,
    height: 1024,
    position: "centre",
    usage: "Under the lens, cars",
    placeholder: "studio-car",
  },
  {
    name: "lens-bike",
    width: 1536,
    height: 1024,
    position: "centre",
    usage: "Under the lens, bikes",
    placeholder: "studio-bike",
  },
  {
    name: "diagnostic-tablet",
    width: 1536,
    height: 1024,
    position: "centre",
    usage: "Services: engine & battery health check",
    placeholder: "still-tablet",
  },
  {
    name: "paint-gauge",
    width: 1024,
    height: 1280,
    position: "centre",
    usage: "Problem section, Services: accident & paint",
    placeholder: "still-gauge",
  },
  {
    name: "handover",
    width: 1024,
    height: 1280,
    position: "centre",
    usage: "Why AutoLens",
    placeholder: "still-handover",
  },
  {
    name: "bike-inspection",
    width: 1024,
    height: 1024,
    position: "centre",
    usage: "Services: hidden-problem detection, Instagram strip",
    placeholder: "bike-scene",
  },
  {
    name: "detail-vin-tyre",
    width: 1024,
    height: 1024,
    position: "centre",
    usage: "Problem section, Instagram strip",
    placeholder: "still-tyre",
  },
  {
    name: "cta-bg",
    width: 1536,
    height: 1024,
    position: "centre",
    usage: "Final call-to-action plate (low-opacity texture)",
    placeholder: "night",
  },
  {
    name: "og-photo",
    width: 1200,
    height: 630,
    position: "centre",
    usage: "Open Graph / social share background",
    placeholder: "scene",
    // Satori (next/og) cannot read WebP/AVIF, so the share image also gets a JPEG.
    extraFormats: ["jpg"],
  },
];

export const RAW_DIR = "raw-images";
export const OUT_DIR = "public/images";
