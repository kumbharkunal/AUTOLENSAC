// Generates tasteful, on-palette placeholder photographs at the exact final paths and sizes,
// so the site looks finished before the real ChatGPT images exist.
//
//   npm run images:placeholders                              create any missing placeholder
//   npm run images:placeholders -- --force handover          overwrite just these (destroys a real image!)
//   npm run images:placeholders -- --force                   overwrite everything (destroys real images!)

import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { IMAGE_SPECS, OUT_DIR } from "./image-specs.mjs";

const force = process.argv.includes("--force");
const only = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));

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
  signal: "#F2C230",
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
      ${blur("soft", Math.round(Math.min(w, h) * 0.008))}
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
    ${car({ ...carBox, body: 0.24, wheel: 0.4, filter: 'filter="url(#soft)"' })}
    ${person({ ...personBox, op: 0.2, filter: 'filter="url(#soft)"' })}`;
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

/* ───────── Still lifes: clear, deliberate illustrations for the close-up photo slots ───────── */

const polar = (cx, cy, r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];

/** SVG arc path on a circle, from `a0` to `a1` degrees (clockwise). */
function arc(cx, cy, r, a0, a1) {
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
}

/** Report-style row: label bar, dotted leader, status pill with a check. */
function readoutRow(x, y, width, label, s = 1) {
  const dots = [];
  const from = x + label + 22 * s;
  const to = x + width - 96 * s;
  for (let dx = from; dx < to; dx += 11 * s) dots.push(`<circle cx="${dx}" cy="${y}" r="${2.4 * s}" fill="${C.ink}" fill-opacity="0.22"/>`);
  const px = x + width - 80 * s;
  return `
    <rect x="${x}" y="${y - 7 * s}" width="${label}" height="${14 * s}" rx="${7 * s}" fill="${C.ink}" fill-opacity="0.26"/>
    ${dots.join("")}
    <rect x="${px}" y="${y - 15 * s}" width="${80 * s}" height="${30 * s}" rx="${15 * s}" fill="${C.lens}" fill-opacity="0.12"/>
    <path d="M ${px + 16 * s} ${y} l ${7 * s} ${7 * s} l ${13 * s} ${-14 * s}" fill="none" stroke="${C.lens}" stroke-width="${4 * s}" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="${px + 44 * s}" y="${y - 4 * s}" width="${24 * s}" height="${8 * s}" rx="${4 * s}" fill="${C.lens}" fill-opacity="0.55"/>`;
}

/** Warm studio backdrop with a soft window light. `horizon` = where the table starts (0-1). */
function backdrop(w, h, horizon) {
  return `
    <defs>
      ${blur("bgHaze", Math.round(Math.min(w, h) * 0.08))}
      <linearGradient id="bd" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#EEE4D4"/>
        <stop offset="${horizon}" stop-color="#F5EEE3"/>
        <stop offset="${horizon}" stop-color="#E5D8C3"/>
        <stop offset="1" stop-color="#EFE6D7"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bd)"/>
    <g filter="url(#bgHaze)">
      <rect x="${w * 0.03}" y="${h * 0.02}" width="${w * 0.32}" height="${h * Math.max(horizon, 0.3) * 0.75}" rx="${w * 0.02}" fill="${C.ivory}"/>
      <circle cx="${w * 0.9}" cy="${h * 0.1}" r="${Math.min(w, h) * 0.16}" fill="${C.tint}" fill-opacity="0.22"/>
    </g>`;
}

/** Diagnostic tablet on a workbench: gauge, readouts and the OBD cable. */
function stillTablet(w, h) {
  const tw = w * 0.5;
  const th = tw * 0.72;
  const g = { x: -tw * 0.23, y: th * 0.04, r: th * 0.26 };
  const [nx, ny] = polar(g.x, g.y, g.r * 0.72, -20);
  const rows = [0, 1, 2, 3]
    .map((i) => readoutRow(tw * 0.02, -th * 0.2 + i * th * 0.14, tw * 0.42, [108, 84, 124, 96][i], 1))
    .join("");
  return `
    ${backdrop(w, h, 0.58)}
    <defs>
      ${blur("shadow", 34)}
      <linearGradient id="bezel" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1C2652"/>
        <stop offset="1" stop-color="${C.navy}"/>
      </linearGradient>
      <linearGradient id="screen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${C.ivory}"/>
        <stop offset="1" stop-color="#F0E9DD"/>
      </linearGradient>
    </defs>
    <path d="M ${w * 0.7} ${h * 0.66} C ${w * 0.8} ${h * 0.72}, ${w * 0.82} ${h * 0.9}, ${w * 1.04} ${h * 0.94}"
      fill="none" stroke="#1B2238" stroke-width="22" stroke-linecap="round"/>
    <g transform="translate(${w * 0.48} ${h * 0.47}) rotate(-6)">
      <rect x="${-tw / 2 + 18}" y="${-th / 2 + 40}" width="${tw}" height="${th}" rx="46" fill="${C.ink}" fill-opacity="0.32" filter="url(#shadow)"/>
      <rect x="${-tw / 2}" y="${-th / 2}" width="${tw}" height="${th}" rx="46" fill="url(#bezel)"/>
      <rect x="${-tw / 2 + 1.5}" y="${-th / 2 + 1.5}" width="${tw - 3}" height="${th - 3}" rx="45" fill="none" stroke="${C.ivory}" stroke-opacity="0.12" stroke-width="3"/>
      <rect x="${-tw / 2 + 28}" y="${-th / 2 + 28}" width="${tw - 56}" height="${th - 56}" rx="22" fill="url(#screen)"/>
      <circle cx="${-tw / 2 + 64}" cy="${-th / 2 + 64}" r="8" fill="${C.lens}"/>
      <rect x="${-tw / 2 + 84}" y="${-th / 2 + 58}" width="150" height="12" rx="6" fill="${C.ink}" fill-opacity="0.22"/>
      <rect x="${tw / 2 - 150}" y="${-th / 2 + 58}" width="94" height="12" rx="6" fill="${C.ink}" fill-opacity="0.12"/>
      <circle cx="${g.x}" cy="${g.y}" r="${g.r}" fill="none" stroke="${C.sand}" stroke-width="22"/>
      <path d="${arc(g.x, g.y, g.r, 135, 345)}" fill="none" stroke="${C.lens}" stroke-width="22" stroke-linecap="round"/>
      <path d="M ${g.x} ${g.y} L ${nx} ${ny}" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>
      <circle cx="${g.x}" cy="${g.y}" r="15" fill="${C.ink}"/>
      <rect x="${g.x - 64}" y="${g.y + g.r * 0.5}" width="128" height="14" rx="7" fill="${C.ink}" fill-opacity="0.26"/>
      <rect x="${g.x - 40}" y="${g.y + g.r * 0.5 + 26}" width="80" height="10" rx="5" fill="${C.lens}" fill-opacity="0.45"/>
      ${rows}
    </g>
    <g transform="translate(${w * 0.7} ${h * 0.66}) rotate(28)">
      <rect x="-46" y="-30" width="92" height="60" rx="14" fill="${C.navy}"/>
      <rect x="-30" y="-16" width="60" height="10" rx="5" fill="${C.ivory}" fill-opacity="0.18"/>
    </g>`;
}

/** Seven-segment digit for the paint gauge's display. */
function digit(x, y, s, n) {
  const on = {
    0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcfgd",
  }[n];
  const seg = {
    a: [0.12, 0, 0.76, 0.1], b: [0.86, 0.08, 0.14, 0.42], c: [0.86, 0.5, 0.14, 0.42], d: [0.12, 0.9, 0.76, 0.1],
    e: [0, 0.5, 0.14, 0.42], f: [0, 0.08, 0.14, 0.42], g: [0.12, 0.45, 0.76, 0.1],
  };
  return [...on]
    .map((k) => {
      const [sx, sy, sw, sh] = seg[k];
      return `<rect x="${x + sx * s}" y="${y + sy * s * 1.8}" width="${sw * s}" height="${sh * s * 1.8}" rx="${s * 0.05}" fill="${C.lens}"/>`;
    })
    .join("");
}

/** Paint-thickness gauge pressed against a car door. */
function stillGauge(w, h) {
  const bw = w * 0.38;
  const bh = h * 0.46;
  return `
    <defs>
      ${blur("shadow", 30)}
      ${blur("sheen", Math.round(w * 0.08))}
      ${blur("glow", 18)}
      <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#E7E2DC"/>
        <stop offset="0.38" stop-color="#F6F3EE"/>
        <stop offset="0.72" stop-color="#D8D3CD"/>
        <stop offset="1" stop-color="#E9E4DE"/>
      </linearGradient>
      <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1E2856"/>
        <stop offset="1" stop-color="${C.navy}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#panel)"/>
    <g filter="url(#sheen)">
      <rect x="${-w * 0.2}" y="${h * 0.3}" width="${w * 1.4}" height="${h * 0.08}" fill="#FFFFFF" fill-opacity="0.75" transform="rotate(-18 ${w / 2} ${h / 2})"/>
    </g>
    <path d="M 0 ${h * 0.16} C ${w * 0.35} ${h * 0.13}, ${w * 0.7} ${h * 0.15}, ${w} ${h * 0.21}" fill="none" stroke="#8F8A83" stroke-opacity="0.55" stroke-width="7"/>
    <path d="M 0 ${h * 0.168} C ${w * 0.35} ${h * 0.138}, ${w * 0.7} ${h * 0.158}, ${w} ${h * 0.218}" fill="none" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="3"/>
    <rect x="${w * 0.08}" y="${h * 0.24}" width="${w * 0.3}" height="${h * 0.045}" rx="${h * 0.022}" fill="#CBC5BE"/>
    <rect x="${w * 0.08}" y="${h * 0.24}" width="${w * 0.3}" height="${h * 0.012}" rx="${h * 0.006}" fill="#B3ADA6"/>
    <g transform="translate(${w * 0.54} ${h * 0.55}) rotate(-12)">
      <ellipse cx="0" cy="${bh / 2 + 70}" rx="70" ry="24" fill="${C.lens}" fill-opacity="0.35" filter="url(#glow)"/>
      <rect x="${-bw / 2 + 30}" y="${-bh / 2 + 44}" width="${bw}" height="${bh}" rx="${bw * 0.26}" fill="${C.ink}" fill-opacity="0.35" filter="url(#shadow)"/>
      <rect x="-34" y="${bh / 2 - 20}" width="68" height="96" rx="14" fill="#2A3354"/>
      <rect x="-22" y="${bh / 2 + 66}" width="44" height="18" rx="9" fill="#11162A"/>
      <rect x="${-bw / 2}" y="${-bh / 2}" width="${bw}" height="${bh}" rx="${bw * 0.26}" fill="url(#body)"/>
      <rect x="${-bw / 2 + 34}" y="${-bh / 2 + 52}" width="${bw - 68}" height="${bh * 0.34}" rx="26" fill="#EEF2FF"/>
      ${digit(-bw / 2 + 62, -bh / 2 + 84, 52, 1)}${digit(-bw / 2 + 128, -bh / 2 + 84, 52, 1)}${digit(-bw / 2 + 194, -bh / 2 + 84, 52, 2)}
      <rect x="${bw / 2 - 98}" y="${-bh / 2 + 160}" width="40" height="10" rx="5" fill="${C.lens}" fill-opacity="0.5"/>
      <circle cx="-46" cy="${bh * 0.12}" r="22" fill="${C.ivory}" fill-opacity="0.16"/>
      <circle cx="46" cy="${bh * 0.12}" r="22" fill="${C.ivory}" fill-opacity="0.16"/>
      <circle cx="0" cy="${bh * 0.26}" r="12" fill="${C.lens}"/>
    </g>`;
}

/** The handover: a finished report with the keys resting on it. */
function stillHandover(w, h) {
  const pw = w * 0.6;
  const ph = pw * 1.36;
  const rows = [0, 1, 2, 3, 4]
    .map((i) => readoutRow(-pw / 2 + 50, -ph * 0.12 + i * ph * 0.075, pw - 100, [150, 120, 170, 132, 110][i], 1))
    .join("");
  return `
    <defs>
      ${blur("shadow", 26)}
      ${blur("haze", Math.round(w * 0.1))}
      <radialGradient id="table" cx="0.4" cy="0.3" r="0.9">
        <stop offset="0" stop-color="#F3EBDE"/>
        <stop offset="1" stop-color="#E0D1BA"/>
      </radialGradient>
      <linearGradient id="fob" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#222C5C"/>
        <stop offset="1" stop-color="${C.navy}"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#table)"/>
    <g filter="url(#haze)"><circle cx="${w * 0.15}" cy="${h * 0.1}" r="${w * 0.3}" fill="${C.ivory}" fill-opacity="0.9"/></g>
    <g transform="translate(${w * 0.46} ${h * 0.47}) rotate(-7)">
      <rect x="${-pw / 2 + 16}" y="${-ph / 2 + 30}" width="${pw}" height="${ph}" rx="10" fill="${C.ink}" fill-opacity="0.22" filter="url(#shadow)"/>
      <rect x="${-pw / 2}" y="${-ph / 2}" width="${pw}" height="${ph}" rx="10" fill="${C.ivory}"/>
      <circle cx="${-pw / 2 + 72}" cy="${-ph / 2 + 74}" r="22" fill="none" stroke="${C.navy}" stroke-width="8"/>
      <circle cx="${-pw / 2 + 72}" cy="${-ph / 2 + 74}" r="9" fill="${C.lens}"/>
      <rect x="${-pw / 2 + 108}" y="${-ph / 2 + 60}" width="150" height="16" rx="8" fill="${C.navy}" fill-opacity="0.85"/>
      <rect x="${-pw / 2 + 108}" y="${-ph / 2 + 86}" width="96" height="10" rx="5" fill="${C.ink}" fill-opacity="0.2"/>
      <rect x="${pw / 2 - 124}" y="${-ph / 2 + 56}" width="78" height="34" rx="6" fill="none" stroke="${C.lens}" stroke-width="3" transform="rotate(-6 ${pw / 2 - 85} ${-ph / 2 + 73})"/>
      <rect x="${-pw / 2 + 50}" y="${-ph * 0.26}" width="${pw - 100}" height="2" fill="${C.ink}" fill-opacity="0.12"/>
      ${rows}
      <rect x="${-pw / 2 + 40}" y="${ph * 0.27}" width="${pw - 80}" height="${ph * 0.13}" rx="18" fill="${C.cream}"/>
      <rect x="${-pw / 2 + 64}" y="${ph * 0.3}" width="${pw * 0.42}" height="12" rx="6" fill="${C.ink}" fill-opacity="0.3"/>
      <rect x="${-pw / 2 + 60}" y="${ph * 0.338}" width="${pw * 0.34}" height="22" rx="8" fill="${C.signal}" fill-opacity="0.6"/>
      <rect x="${-pw / 2 + 64}" y="${ph * 0.345}" width="${pw * 0.3}" height="10" rx="5" fill="${C.ink}" fill-opacity="0.3"/>
    </g>
    <g transform="translate(${w * 0.7} ${h * 0.7}) rotate(24)">
      <rect x="-66" y="-108" width="150" height="250" rx="72" fill="${C.ink}" fill-opacity="0.32" filter="url(#shadow)"/>
      <circle cx="0" cy="-178" r="62" fill="none" stroke="#A9A49C" stroke-width="13"/>
      <circle cx="0" cy="-178" r="62" fill="none" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="3"/>
      <rect x="-30" y="-150" width="60" height="58" rx="18" fill="#9C8166"/>
      <rect x="-75" y="-125" width="150" height="250" rx="72" fill="url(#fob)"/>
      <circle cx="0" cy="-48" r="21" fill="${C.ivory}" fill-opacity="0.16"/>
      <circle cx="0" cy="12" r="21" fill="${C.ivory}" fill-opacity="0.16"/>
      <circle cx="0" cy="72" r="21" fill="${C.ivory}" fill-opacity="0.16"/>
      <circle cx="0" cy="-92" r="6" fill="${C.lens}"/>
    </g>`;
}

/** Tyre sidewall macro, with the date code under the lens. */
function stillTyre(w, h) {
  const cx = w * 0.62;
  const cy = h * 0.6;
  const R = w * 0.6;
  const notches = Array.from({ length: 90 }, (_, i) => {
    const a = i * 4;
    const [x, y] = polar(cx, cy, R * 0.965, a);
    return `<rect x="${x - 7}" y="${y - 22}" width="14" height="44" rx="4" fill="#0F121C" fill-opacity="0.55" transform="rotate(${a} ${x} ${y})"/>`;
  }).join("");
  const letters = (r, a0, count, step, len) =>
    Array.from({ length: count }, (_, i) => {
      const a = a0 + i * step;
      const [x, y] = polar(cx, cy, r, a);
      return `<rect x="${x - 5}" y="${y - len / 2}" width="10" height="${len}" rx="4" fill="#4A5170" transform="rotate(${a} ${x} ${y})"/>`;
    }).join("");
  const stampA = 228;
  const [sx, sy] = polar(cx, cy, R * 0.76, stampA);
  return `
    <defs>
      ${blur("shadow", 30)}
      <radialGradient id="bg" cx="0.2" cy="0.2" r="1">
        <stop offset="0" stop-color="${C.ivory}"/>
        <stop offset="1" stop-color="${C.sand}"/>
      </radialGradient>
      <radialGradient id="rubber" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0.55" stop-color="#2E3448"/>
        <stop offset="1" stop-color="#181B27"/>
      </radialGradient>
      <linearGradient id="alloy" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#F3F1ED"/>
        <stop offset="0.55" stop-color="#C3C0BB"/>
        <stop offset="1" stop-color="#E8E5E0"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <circle cx="${cx + 30}" cy="${cy + 40}" r="${R}" fill="${C.ink}" fill-opacity="0.3" filter="url(#shadow)"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#rubber)"/>
    ${notches}
    <circle cx="${cx}" cy="${cy}" r="${R * 0.9}" fill="#272C3E"/>
    <circle cx="${cx}" cy="${cy}" r="${R * 0.9}" fill="none" stroke="#3A4058" stroke-width="4"/>
    ${letters(R * 0.8, 150, 9, 3.2, 34)}${letters(R * 0.8, 252, 6, 3.2, 34)}${letters(R * 0.72, 196, 5, 3.6, 22)}
    <g transform="rotate(${stampA + 90} ${sx} ${sy})">
      <rect x="${sx - 92}" y="${sy - 34}" width="184" height="68" rx="16" fill="none" stroke="#5A6282" stroke-width="5"/>
      ${[0, 1, 2, 3].map((i) => `<rect x="${sx - 70 + i * 36}" y="${sy - 18}" width="26" height="36" rx="6" fill="#6B7394"/>`).join("")}
    </g>
    <circle cx="${cx}" cy="${cy}" r="${R * 0.6}" fill="url(#alloy)"/>
    ${[0, 72, 144, 216, 288]
      .map((a) => `<path d="${arc(cx, cy, R * 0.5, a + 16, a + 56)} L ${polar(cx, cy, R * 0.2, a + 36).join(" ")} Z" fill="#1E2232"/>`)
      .join("")}
    <circle cx="${cx}" cy="${cy}" r="${R * 0.17}" fill="#D9D6D1"/>
    <circle cx="${cx}" cy="${cy}" r="${R * 0.08}" fill="${C.navy}"/>
    <circle cx="${cx}" cy="${cy}" r="${R * 0.03}" fill="${C.lens}"/>
    <circle cx="${sx}" cy="${sy}" r="132" fill="${C.ivory}" fill-opacity="0.1"/>
    <circle cx="${sx}" cy="${sy}" r="132" fill="none" stroke="${C.ivory}" stroke-width="12"/>
    <circle cx="${sx}" cy="${sy}" r="124" fill="none" stroke="${C.lens}" stroke-width="3"/>
    <path d="${arc(sx, sy, 108, 200, 250)}" fill="none" stroke="#FFFFFF" stroke-opacity="0.5" stroke-width="8" stroke-linecap="round"/>
    <path d="M ${polar(sx, sy, 136, 45).join(" ")} L ${polar(sx, sy, 250, 45).join(" ")}" stroke="${C.ivory}" stroke-width="26" stroke-linecap="round"/>`;
}

function svgFor(spec) {
  const { width: w, height: h, placeholder } = spec;
  const body = {
    scene: () => scene(w, h, false),
    "scene-portrait": () => scene(w, h, true),
    "studio-car": () => studio(w, h, "car"),
    "studio-bike": () => studio(w, h, "bike"),
    "bike-scene": () => bikeScene(w, h),
    night: () => nightScene(w, h),
    "still-tablet": () => stillTablet(w, h),
    "still-gauge": () => stillGauge(w, h),
    "still-handover": () => stillHandover(w, h),
    "still-tyre": () => stillTyre(w, h),
  }[placeholder]();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
}

mkdirSync(OUT_DIR, { recursive: true });
const unknown = only.filter((name) => !IMAGE_SPECS.some((spec) => spec.name === name));
if (unknown.length) console.warn(`unknown image name(s): ${unknown.join(", ")}`);
let made = 0;
for (const spec of IMAGE_SPECS) {
  if (only.length && !only.includes(spec.name)) continue;
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
