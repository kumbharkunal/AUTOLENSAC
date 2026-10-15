// Turns the PNGs you download from ChatGPT into the optimized files the site uses.
//
// 1. Save each image into /raw-images using the exact name from IMAGE_PROMPTS.md,
//    e.g. raw-images/hero-desktop.png (png, jpg, jpeg or webp all work).
// 2. Run:  npm run images            (all images found in /raw-images)
//          npm run images -- hero-desktop lens-car   (only these)
// 3. Commit /public/images and redeploy. next/image then serves AVIF/WebP at every size.

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
  const base = path.join(OUT_DIR, spec.name);
  // `rotate()` applies EXIF orientation; `cover` crops to the final aspect ratio around `position`.
  const pipeline = () =>
    sharp(raw)
      .rotate()
      .resize(spec.width, spec.height, { fit: "cover", position: spec.position, withoutEnlargement: false })
      .toColourspace("srgb");

  await pipeline().webp({ quality: 85, effort: 6, smartSubsample: true }).toFile(`${base}.webp`);
  await pipeline().avif({ quality: 58, effort: 6 }).toFile(`${base}.avif`);
  for (const fmt of spec.extraFormats ?? []) {
    if (fmt === "jpg") await pipeline().jpeg({ quality: 84, mozjpeg: true }).toFile(`${base}.jpg`);
  }

  const smaller = meta.width < spec.width || meta.height < spec.height;
  console.log(
    `ok     ${spec.name.padEnd(18)} ${meta.width}x${meta.height} -> ${spec.width}x${spec.height}` +
      `  webp ${kb(statSync(`${base}.webp`).size)}  avif ${kb(statSync(`${base}.avif`).size)}` +
      (smaller ? "  (source smaller than target: upscaled)" : ""),
  );
  done++;
}

if (missing.length) {
  console.log(`\nStill using placeholders for: ${missing.join(", ")}`);
}
console.log(`\n${done} image(s) optimized into ${OUT_DIR}. Commit and redeploy to publish them.`);
