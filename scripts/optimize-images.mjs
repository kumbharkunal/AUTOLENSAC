// Turns the images you download from ChatGPT into the optimized files the site uses.
//
// 1. Save each image into /raw-images using the exact name from IMAGE_PROMPTS.md,
//    e.g. raw-images/hero-desktop.png (png, jpg, jpeg or webp all work).
// 2. Run:  npm run images            (all images found in /raw-images)
//          npm run images -- hero-desktop lens-car   (only these)
// 3. Commit /public/images and redeploy. next/image then serves AVIF/WebP at every size.
//
// How each image is fitted (`fit` in scripts/image-specs.mjs): "inside" keeps the whole photo at its
// own shape, "pad" extends its backdrop to an exact frame, "extend" adds backdrop on chosen sides,
// "cover" crops to an exact size.

import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { IMAGE_SPECS, OUT_DIR, RAW_DIR } from "./image-specs.mjs";

const EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];
const only = process.argv.slice(2).filter((arg) => !arg.startsWith("-"));
const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

function findRaw(name) {
  for (const ext of EXTENSIONS) {
    const file = path.join(RAW_DIR, name + ext);
    if (existsSync(file)) return file;
  }
  return null;
}

/**
 * Grows a photo's canvas by `top/right/bottom/left` pixels with its own backdrop: the edges are
 * stretched outwards, blurred (so image grain can't streak) and the photo's edges are feathered
 * into them, so a plain studio wall, ceiling or window simply continues.
 */
async function extendBackdrop(png, { top = 0, right = 0, bottom = 0, left = 0 }, { blur = 24, feather = 0.04 } = {}) {
  if (!top && !right && !bottom && !left) return png;
  const { width: fw, height: fh } = await sharp(png).metadata();
  const extended = await sharp(png).extend({ top, bottom, left, right, extendWith: "copy" }).png().toBuffer();
  const backdrop = await sharp(extended).blur(blur).png().toBuffer();

  // Feather only the edges that were extended (one gradient per axis, multiplied by dest-in).
  const f = Math.max(32, Math.round(Math.min(fw, fh) * feather));
  const gradient = (vertical, from, to, length) =>
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${fw}" height="${fh}"><defs>` +
        `<linearGradient id="g" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">` +
        `<stop offset="0" stop-color="#fff" stop-opacity="${from ? 0 : 1}"/>` +
        `<stop offset="${f / length}" stop-color="#fff" stop-opacity="1"/>` +
        `<stop offset="${1 - f / length}" stop-color="#fff" stop-opacity="1"/>` +
        `<stop offset="1" stop-color="#fff" stop-opacity="${to ? 0 : 1}"/>` +
        `</linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`,
    );
  let feathered = await sharp(png).ensureAlpha().png().toBuffer();
  if (top || bottom) {
    feathered = await sharp(feathered).composite([{ input: gradient(true, top, bottom, fh), blend: "dest-in" }]).png().toBuffer();
  }
  if (left || right) {
    feathered = await sharp(feathered).composite([{ input: gradient(false, left, right, fw), blend: "dest-in" }]).png().toBuffer();
  }
  return sharp(backdrop).composite([{ input: feathered, top, left }]).png().toBuffer();
}

/** "pad": the photo fitted inside the frame, centred, with its backdrop filling the rest. */
async function pad(raw, { width: W, height: H }) {
  const fitted = await sharp(raw)
    .rotate()
    .toColourspace("srgb")
    .removeAlpha()
    .resize(W, H, { fit: "inside" })
    .png()
    .toBuffer({ resolveWithObject: true });
  const { width: fw, height: fh } = fitted.info;
  const left = Math.floor((W - fw) / 2);
  const top = Math.floor((H - fh) / 2);
  return extendBackdrop(fitted.data, { top, left, right: W - fw - left, bottom: H - fh - top });
}

/**
 * "extend": the whole photo at its own scale, with extra backdrop added on the sides named in
 * `spec.extend` (fractions of the photo's width/height). Gives a tightly framed shot the room a
 * layout needs (e.g. space above a subject for the navigation, or beside it for a headline).
 */
async function extend(raw, spec) {
  const photo = await sharp(raw).rotate().toColourspace("srgb").removeAlpha().png().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = photo.info;
  const e = spec.extend ?? {};
  const grown = await extendBackdrop(
    photo.data,
    {
      top: Math.round((e.top ?? 0) * h),
      bottom: Math.round((e.bottom ?? 0) * h),
      left: Math.round((e.left ?? 0) * w),
      right: Math.round((e.right ?? 0) * w),
    },
    // Large extensions need a soft, wide blend: they should read as out-of-focus light.
    { blur: 110, feather: 0.14 },
  );
  return sharp(grown).resize(spec.width, spec.height, { fit: "inside", withoutEnlargement: true }).png().toBuffer();
}

/** The fitted image, as a lossless PNG buffer ready to encode. */
async function render(raw, spec) {
  const fit = spec.fit ?? "inside";
  if (fit === "pad") return pad(raw, spec);
  if (fit === "extend") return extend(raw, spec);
  const image = sharp(raw).rotate().toColourspace("srgb");
  if (fit === "cover") {
    return image.resize(spec.width, spec.height, { fit: "cover", position: spec.position ?? "centre" }).png().toBuffer();
  }
  return image.resize(spec.width, spec.height, { fit: "inside", withoutEnlargement: true }).png().toBuffer();
}

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(RAW_DIR, { recursive: true });

const known = new Set(IMAGE_SPECS.map((spec) => spec.name));
for (const file of readdirSync(RAW_DIR)) {
  const { name, ext } = path.parse(file);
  if (EXTENSIONS.includes(ext.toLowerCase()) && !known.has(name)) {
    console.warn(`?      ${file} does not match any image name in scripts/image-specs.mjs (ignored)`);
  }
}

let done = 0;
const missing = [];

for (const spec of IMAGE_SPECS) {
  if (only.length && !only.includes(spec.name)) continue;

  const raw = findRaw(spec.name);
  if (!raw) {
    missing.push(spec.name);
    continue;
  }

  const meta = await sharp(raw).metadata();
  const png = await render(raw, spec);
  const out = await sharp(png).metadata();
  const base = path.join(OUT_DIR, spec.name);

  await sharp(png).webp({ quality: 85, effort: 6, smartSubsample: true }).toFile(`${base}.webp`);
  await sharp(png).avif({ quality: 58, effort: 6 }).toFile(`${base}.avif`);
  for (const fmt of spec.extraFormats ?? []) {
    if (fmt === "jpg") await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(`${base}.jpg`);
  }

  // How much the photo itself was scaled ("pad" adds backdrop around it, which isn't upscaling).
  const fit = spec.fit ?? "inside";
  const grownWidth = meta.width * (1 + (spec.extend?.left ?? 0) + (spec.extend?.right ?? 0));
  const scale =
    fit === "inside"
      ? out.width / meta.width
      : fit === "extend"
        ? out.width / Math.round(grownWidth)
        : (fit === "pad" ? Math.min : Math.max)(spec.width / meta.width, spec.height / meta.height);
  const upscaled = scale > 1.01;
  console.log(
    `ok     ${spec.name.padEnd(18)} ${meta.width}x${meta.height} -> ${out.width}x${out.height} (${fit})` +
      `  webp ${kb(statSync(`${base}.webp`).size)}  avif ${kb(statSync(`${base}.avif`).size)}` +
      (upscaled ? "  (source smaller than the frame: upscaled)" : ""),
  );
  done++;
}

if (missing.length) {
  console.log(`\nStill using placeholders for: ${missing.join(", ")}`);
}
console.log(`\n${done} image(s) optimized into ${OUT_DIR}. Commit and redeploy to publish them.`);
