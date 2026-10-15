// Generates tasteful, on-palette placeholder photographs at the exact final paths and sizes,
// so the site looks finished before the real ChatGPT images exist.
//
//   npm run images:placeholders           create any missing placeholder
//   npm run images:placeholders -- --force overwrite everything (destroys real images!)

import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { IMAGE_SPECS, OUT_DIR } from "./image-specs.mjs";

const force = process.argv.includes("--force");

const C = {
  cream: "#F4EDE2",
  ivory: "#FBF8F2",
  sand: "#E6DCCB",
  wall: "#ECE2D2",
  floor: "#F7F1E7",
  ink: "#121A36",
  navy: "#0B1438",
  lens: "#1A47D1",
  tint: "#9DB1F2",
};

const blur = (id, s) =>
  `<filter id="${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${s}"/></filter>`;

/** Side-profile car silhouette facing left, in a box (x, y, w, h). */
function car({ x, y, w, h, body = 0.17, wheel = 0.3, filter = "" }) {
  const wr = h * 0.26;
  return `<g ${filter}>
    <path d="M ${x + w * 0.04} ${y + h * 0.72}
      C ${x + w * 0.02} ${y + h * 0.5}, ${x + w * 0.08} ${y + h * 0.42}, ${x + w * 0.2} ${y + h * 0.38}
      L ${x + w * 0.33} ${y + h * 0.08}
      C ${x + w * 0.36} ${y + h * 0.02}, ${x + w * 0.42} ${y}, ${x + w * 0.5} ${y}
      L ${x + w * 0.72} ${y}
      C ${x + w * 0.8} ${y}, ${x + w * 0.84} ${y + h * 0.06}, ${x + w * 0.88} ${y + h * 0.36}
      C ${x + w * 0.97} ${y + h * 0.42}, ${x + w} ${y + h * 0.52}, ${x + w * 0.98} ${y + h * 0.74}
      L ${x + w * 0.98} ${y + h * 0.8} L ${x + w * 0.03} ${y + h * 0.8} Z"
      fill="${C.ink}" fill-opacity="${body}"/>
    <path d="M ${x + w * 0.36} ${y + h * 0.11} L ${x + w * 0.84} ${y + h * 0.11}
      L ${x + w * 0.86} ${y + h * 0.34} L ${x + w * 0.27} ${y + h * 0.35} Z"
      fill="${C.ivory}" fill-opacity="0.35"/>
    <circle cx="${x + w * 0.2}" cy="${y + h * 0.8}" r="${wr}" fill="${C.ink}" fill-opacity="${wheel}"/>
    <circle cx="${x + w * 0.8}" cy="${y + h * 0.8}" r="${wr}" fill="${C.ink}" fill-opacity="${wheel}"/>
    <circle cx="${x + w * 0.2}" cy="${y + h * 0.8}" r="${wr * 0.48}" fill="${C.sand}" fill-opacity="0.5"/>
    <circle cx="${x + w * 0.8}" cy="${y + h * 0.8}" r="${wr * 0.48}" fill="${C.sand}" fill-opacity="0.5"/>
  </g>`;
}

/** Side-profile motorcycle silhouette facing left. */
function bike({ x, y, w, h, op = 0.28, filter = "" }) {
  const r = h * 0.28;
  const p = (px, py) => `${x + w * px} ${y + h * py}`;
  return `<g ${filter}>
    <path d="M ${p(0.2, 0.7)} L ${p(0.29, 0.16)}" stroke="${C.ink}" stroke-opacity="${op}" stroke-width="${h * 0.05}" stroke-linecap="round"/>
    <path d="M ${p(0.24, 0.12)} L ${p(0.37, 0.08)}" stroke="${C.ink}" stroke-opacity="${op}" stroke-width="${h * 0.045}" stroke-linecap="round"/>
    <path d="M ${p(0.31, 0.32)} L ${p(0.45, 0.22)} L ${p(0.58, 0.25)} L ${p(0.62, 0.2)} L ${p(0.86, 0.21)}
      L ${p(0.91, 0.34)} L ${p(0.72, 0.48)} L ${p(0.52, 0.62)} L ${p(0.37, 0.58)} Z"
      fill="${C.ink}" fill-opacity="${op * 0.75}"/>
    <circle cx="${x + w * 0.25}" cy="${y + h * 0.3}" r="${h * 0.06}" fill="${C.ivory}" fill-opacity="0.6"/>
    <circle cx="${x + w * 0.2}" cy="${y + h * 0.7}" r="${r}" fill="${C.ink}" fill-opacity="${op * 1.15}"/>
    <circle cx="${x + w * 0.8}" cy="${y + h * 0.7}" r="${r}" fill="${C.ink}" fill-opacity="${op * 1.15}"/>
    <circle cx="${x + w * 0.2}" cy="${y + h * 0.7}" r="${r * 0.55}" fill="${C.sand}" fill-opacity="0.55"/>
    <circle cx="${x + w * 0.8}" cy="${y + h * 0.7}" r="${r * 0.55}" fill="${C.sand}" fill-opacity="0.55"/>
  </g>`;
}

function person({ x, y, w, h, op = 0.14, filter = "" }) {
  return `<g ${filter}>
    <circle cx="${x + w * 0.5}" cy="${y + h * 0.08}" r="${w * 0.22}" fill="${C.ink}" fill-opacity="${op}"/>
    <rect x="${x + w * 0.12}" y="${y + h * 0.18}" width="${w * 0.76}" height="${h * 0.42}" rx="${w * 0.3}" fill="${C.navy}" fill-opacity="${op * 1.3}"/>
    <rect x="${x + w * 0.2}" y="${y + h * 0.56}" width="${w * 0.6}" height="${h * 0.44}" rx="${w * 0.18}" fill="${C.ink}" fill-opacity="${op}"/>
  </g>`;
}

function scene(w, h, portrait = false) {
  const horizon = portrait ? 0.56 : 0.64;
  const carBox = portrait
    ? { x: w * 0.06, y: h * 0.3, w: w * 0.88, h: h * 0.22 }
    : { x: w * 0.42, y: h * 0.33, w: w * 0.5, h: h * 0.32 };
  const personBox = portrait
    ? { x: w * 0.66, y: h * 0.18, w: w * 0.14, h: h * 0.34 }
    : { x: w * 0.3, y: h * 0.22, w: w * 0.09, h: h * 0.46 };
  return `
    <defs>
      ${blur("soft", Math.round(Math.min(w, h) * 0.018))}
      ${blur("haze", Math.round(Math.min(w, h) * 0.06))}
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${C.wall}"/>
        <stop offset="${horizon}" stop-color="${C.cream}"/>
        <stop offset="${horizon}" stop-color="#E9DECB"/>
        <stop offset="1" stop-color="${C.floor}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#wall)"/>
    <g filter="url(#haze)">
      <rect x="${portrait ? w * 0.08 : w * 0.04}" y="${h * 0.04}" width="${portrait ? w * 0.5 : w * 0.3}" height="${h * 0.42}" rx="${w * 0.02}" fill="${C.ivory}"/>
      <rect x="${portrait ? w * 0.6 : w * 0.38}" y="${h * 0.06}" width="${portrait ? w * 0.32 : w * 0.2}" height="${h * 0.36}" rx="${w * 0.02}" fill="${C.ivory}" fill-opacity="0.8"/>
      <ellipse cx="${carBox.x + carBox.w * 0.5}" cy="${carBox.y + carBox.h * 1.02}" rx="${carBox.w * 0.6}" ry="${carBox.h * 0.16}" fill="${C.ink}" fill-opacity="0.16"/>
      <circle cx="${personBox.x + personBox.w * 0.9}" cy="${personBox.y + personBox.h * 0.42}" r="${Math.min(w, h) * 0.05}" fill="${C.lens}" fill-opacity="0.12"/>
    </g>
    ${car({ ...carBox, filter: 'filter="url(#soft)"' })}
    ${person({ ...personBox, filter: 'filter="url(#soft)"' })}`;
}

function studio(w, h, kind) {
  return `
    <defs>
      ${blur("soft", 5)}
      ${blur("shadow", 26)}
      <radialGradient id="seam" cx="0.5" cy="0.38" r="0.75">
        <stop offset="0" stop-color="${C.ivory}"/>
        <stop offset="0.7" stop-color="${C.cream}"/>
        <stop offset="1" stop-color="${C.sand}"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#seam)"/>
    <ellipse cx="${w * 0.5}" cy="${h * 0.79}" rx="${w * 0.36}" ry="${h * 0.04}" fill="${C.ink}" fill-opacity="0.18" filter="url(#shadow)"/>
    ${
      kind === "car"
        ? car({ x: w * 0.12, y: h * 0.34, w: w * 0.76, h: h * 0.42, body: 0.2, wheel: 0.36, filter: 'filter="url(#soft)"' })
        : bike({ x: w * 0.22, y: h * 0.36, w: w * 0.56, h: h * 0.42, filter: 'filter="url(#soft)"' })
    }`;
}

function bokeh(w, h, seed = 1, dark = false) {
  const m = Math.min(w, h);
  const spots = [
    [0.22, 0.3, 0.26, dark ? C.tint : C.ivory, dark ? 0.16 : 0.95],
    [0.68, 0.42, 0.34, dark ? C.lens : C.sand, dark ? 0.28 : 0.9],
    [0.5, 0.78, 0.22, dark ? C.ivory : C.lens, dark ? 0.06 : 0.1],
    [0.86, 0.16, 0.14, dark ? C.tint : C.ivory, dark ? 0.12 : 0.8],
    [0.12, 0.82, 0.18, dark ? C.navy : C.ink, dark ? 0.5 : 0.07],
  ];
  const rot = (seed * 37) % 360;
  return `
    <defs>
      ${blur("haze", Math.round(m * 0.07))}
      <linearGradient id="bg" gradientTransform="rotate(${rot % 90} .5 .5)">
        <stop offset="0" stop-color="${dark ? C.navy : C.sand}"/>
        <stop offset="1" stop-color="${dark ? "#16224F" : C.cream}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <g filter="url(#haze)">
      ${spots
        .map(
          ([cx, cy, r, fill, op], i) =>
            `<circle cx="${w * ((cx + seed * 0.07 * (i % 2 ? 1 : -1) + 1) % 1)}" cy="${h * cy}" r="${m * r}" fill="${fill}" fill-opacity="${op}"/>`,
        )
        .join("")}
    </g>`;
}

function warmPortrait(w, h) {
  return `
    <defs>
      ${blur("haze", Math.round(w * 0.06))}
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#EADCC8"/>
        <stop offset="1" stop-color="${C.floor}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <g filter="url(#haze)">
      <ellipse cx="${w * 0.36}" cy="${h * 0.5}" rx="${w * 0.24}" ry="${h * 0.1}" fill="#C9A88A" fill-opacity="0.45"/>
      <ellipse cx="${w * 0.66}" cy="${h * 0.56}" rx="${w * 0.22}" ry="${h * 0.09}" fill="#B8957A" fill-opacity="0.4"/>
      <circle cx="${w * 0.52}" cy="${h * 0.52}" r="${w * 0.06}" fill="${C.ink}" fill-opacity="0.25"/>
      <circle cx="${w * 0.8}" cy="${h * 0.18}" r="${w * 0.2}" fill="${C.ivory}"/>
    </g>`;
}

function bikeScene(w, h) {
  return `
    <defs>
      ${blur("soft", Math.round(w * 0.012))}
      ${blur("haze", Math.round(w * 0.06))}
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${C.wall}"/>
        <stop offset="0.62" stop-color="${C.cream}"/>
        <stop offset="0.62" stop-color="#E9DECB"/>
        <stop offset="1" stop-color="${C.floor}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <g filter="url(#haze)"><rect x="${w * 0.06}" y="${h * 0.06}" width="${w * 0.4}" height="${h * 0.42}" rx="${w * 0.03}" fill="${C.ivory}"/></g>
    ${bike({ x: w * 0.22, y: h * 0.38, w: w * 0.6, h: h * 0.32, op: 0.3, filter: 'filter="url(#soft)"' })}
    ${person({ x: w * 0.12, y: h * 0.26, w: w * 0.13, h: h * 0.5, filter: 'filter="url(#soft)"' })}`;
}

function nightScene(w, h) {
  return `
    ${bokeh(w, h, 3, true)}
    <g filter="url(#haze)">
      <ellipse cx="${w * 0.5}" cy="${h * 0.7}" rx="${w * 0.4}" ry="${h * 0.06}" fill="${C.tint}" fill-opacity="0.12"/>
    </g>`;
}

function svgFor(spec) {
  const { width: w, height: h, placeholder } = spec;
  const seed = spec.name.length;
  const body = {
    scene: () => scene(w, h, false),
    "scene-portrait": () => scene(w, h, true),
    "studio-car": () => studio(w, h, "car"),
    "studio-bike": () => studio(w, h, "bike"),
    macro: () => bokeh(w, h, seed),
    "macro-portrait": () => bokeh(w, h, seed),
    "macro-square": () => bokeh(w, h, seed + 2),
    "warm-portrait": () => warmPortrait(w, h),
    "bike-scene": () => bikeScene(w, h),
    night: () => nightScene(w, h),
  }[placeholder]();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
}

mkdirSync(OUT_DIR, { recursive: true });
let made = 0;
for (const spec of IMAGE_SPECS) {
  const base = path.join(OUT_DIR, spec.name);
  if (!force && existsSync(`${base}.webp`)) {
    console.log(`skip   ${spec.name} (exists)`);
    continue;
  }
  const png = await sharp(Buffer.from(svgFor(spec))).png().toBuffer();
  await sharp(png).webp({ quality: 82, effort: 5 }).toFile(`${base}.webp`);
  await sharp(png).avif({ quality: 52, effort: 4 }).toFile(`${base}.avif`);
  for (const fmt of spec.extraFormats ?? []) {
    if (fmt === "jpg") await sharp(png).jpeg({ quality: 84, mozjpeg: true }).toFile(`${base}.jpg`);
  }
  made++;
  console.log(`made   ${spec.name} ${spec.width}x${spec.height}`);
}
console.log(`\n${made} placeholder(s) written to ${OUT_DIR}`);
