// Single source of truth for every photograph on the site.
// Used by scripts/optimize-images.mjs (real images) and scripts/generate-placeholders.mjs.
//
// `width`/`height` = the export box in /public/images. `fit` decides how a photo goes into it:
// - "inside" (default): the whole photo, at its own shape, scaled down to fit the box (never up).
//   For slots where the page crops the photo itself (object-cover), so nothing is lost up front.
// - "pad":   fit inside the box, then extend the photo's own backdrop to fill it exactly.
//   For studio shots that must keep the whole vehicle in a fixed-shape frame.
// - "extend": the whole photo plus extra backdrop on the sides in `extend` (fractions of the
//   photo's width/height), then fitted inside the box. For a tightly framed shot that needs room.
// - "cover": crop to exactly width x height around `position` (sharp gravity).
// The page reads each file's real size at build time, so any shape works with "inside".

export const IMAGE_SPECS = [
  {
    // Laptop screens make the hero about 2:1. The shot is framed tightly, so it gets extra ceiling
    // (keeps the inspector's head clear of the floating navigation) and extra window light on the
    // left (calm space behind the headline), putting the subject in the right half.
    name: "hero-desktop",
    width: 2560,
    height: 1440,
    fit: "extend",
    extend: { top: 0.19, left: 0.41 },
    usage: "Hero, landscape screens 768px and wider",
    placeholder: "scene",
  },
  {
    name: "hero-mobile",
    width: 1080,
    height: 1920,
    fit: "inside",
    usage: "Hero, phones and portrait tablets",
    placeholder: "scene-portrait",
  },
  {
    // The stage is 3:2; padding keeps the whole car in view (hotspots: x/y fractions of this frame).
    name: "lens-car",
    width: 1536,
    height: 1024,
    fit: "pad",
    usage: "Under the lens, cars",
    placeholder: "studio-car",
  },
  {
    name: "lens-bike",
    width: 1536,
    height: 1024,
    fit: "pad",
    usage: "Under the lens, bikes",
    placeholder: "studio-bike",
  },
  {
    name: "diagnostic-tablet",
    width: 1600,
    height: 1200,
    fit: "inside",
    usage: "Services: engine & battery health check, Instagram strip",
    placeholder: "still-tablet",
  },
  {
    name: "paint-gauge",
    width: 1080,
    height: 1620,
    fit: "inside",
    usage: "Services: accident & paint, Instagram strip",
    placeholder: "still-gauge",
  },
  {
    name: "handover",
    width: 1200,
    height: 1500,
    fit: "inside",
    usage: "Why AutoLens",
    placeholder: "still-handover",
  },
  {
    name: "bike-inspection",
    width: 1280,
    height: 1280,
    fit: "inside",
    usage: "Services: hidden-problem detection, Instagram strip",
    placeholder: "bike-scene",
  },
  {
    name: "detail-vin-tyre",
    width: 1280,
    height: 1280,
    fit: "inside",
    usage: "Problem section, Instagram strip",
    placeholder: "still-tyre",
  },
  {
    name: "cta-bg",
    width: 1920,
    height: 1280,
    fit: "inside",
    usage: "Final call-to-action plate (low-opacity texture)",
    placeholder: "night",
  },
  {
    // Exact share-card size; the subject sits on the right, clear of the card's text on the left.
    name: "og-photo",
    width: 1200,
    height: 630,
    fit: "cover",
    position: "right",
    usage: "Open Graph / social share background",
    placeholder: "scene",
    // Satori (next/og) cannot read WebP/AVIF, so the share image also gets a JPEG.
    extraFormats: ["jpg"],
  },
];

export const RAW_DIR = "raw-images";
export const OUT_DIR = "public/images";
