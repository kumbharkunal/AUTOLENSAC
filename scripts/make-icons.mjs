// Builds the favicon set from the AutoLens lens mark (the magnifier "o" of the wordmark).
//   node scripts/make-icons.mjs
// Writes app/icon.svg, app/apple-icon.png and app/favicon.ico (16, 32, 48 px PNGs in one .ico).
// TODO: rebuild from the official logo file when the client supplies it.

import { writeFileSync } from "node:fs";
import sharp from "sharp";

const NAVY = "#0B1438";
const LENS = "#1A47D1";
const IVORY = "#FBF8F2";

const mark = (ring = NAVY) => `
  <path d="M31.6 31.6 42 42" stroke="${ring}" stroke-width="5.6" stroke-linecap="round" fill="none" class="ring"/>
  <circle cx="21" cy="21" r="14.2" stroke="${ring}" stroke-width="5.2" fill="none" class="ring"/>
  <circle cx="21" cy="21" r="7.6" fill="${LENS}"/>
  <circle cx="18.2" cy="18.2" r="2.1" fill="#fff" fill-opacity="0.85"/>`;

// Browser-tab icon: adapts to dark tab bars.
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <style>@media (prefers-color-scheme: dark){.ring{stroke:${IVORY}}}</style>${mark()}
</svg>
`;
writeFileSync("app/icon.svg", iconSvg);

// Apple touch icon: ivory tile, mark centred.
const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="${IVORY}"/>
  <g transform="translate(38 38) scale(2.25)">${mark()}</g>
</svg>`;
await sharp(Buffer.from(appleSvg)).png().toFile("app/apple-icon.png");

// favicon.ico with PNG-compressed entries.
const sizes = [16, 32, 48];
const pngs = await Promise.all(
  sizes.map((size) =>
    sharp(
      Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="-1 -1 46 46">${mark()}</svg>`,
      ),
    )
      .png()
      .toBuffer(),
  ),
);
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((size, i) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0);
  entry.writeUInt8(size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngs[i].length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return entry;
});
writeFileSync("app/favicon.ico", Buffer.concat([header, ...entries, ...pngs]));

console.log("icons written: app/icon.svg, app/apple-icon.png, app/favicon.ico");
