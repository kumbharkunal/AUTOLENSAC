import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { site } from "@/content/site";

export const alt = "AutoLens: Pre-Delivery Inspection and Vehicle Consultancy for cars and bikes";
export const size = { width: 1200, height: 630 };
// JPEG, not PNG: with a real photo the PNG is ~800 KB, and WhatsApp skips link-preview images much
// over 300 KB. The card is rendered once at build time, so the conversion costs nothing per visit.
export const contentType = "image/jpeg";

const LENS_MARK = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M31.6 31.6 42 42" stroke="#0B1438" stroke-width="5.6" stroke-linecap="round" fill="none"/><circle cx="21" cy="21" r="14.2" stroke="#0B1438" stroke-width="5.2" fill="none"/><circle cx="21" cy="21" r="7.6" fill="#1A47D1"/><circle cx="18.2" cy="18.2" r="2.1" fill="#fff" fill-opacity="0.85"/></svg>`,
).toString("base64")}`;

/**
 * Social share card, generated at build time. Uses /public/images/og-photo.jpg as the
 * background when present (run `npm run images` after adding raw-images/og-photo.png).
 */
// Assets load once at module evaluation (top-level await), so the image stays static.
const root = process.cwd();
const [serif, serifItalic, sans, photo] = await Promise.all([
  readFile(join(root, "assets/fonts/CormorantGaramond-Medium.ttf")),
  readFile(join(root, "assets/fonts/CormorantGaramond-MediumItalic.ttf")),
  readFile(join(root, "assets/fonts/Geist-Medium.ttf")),
  readFile(join(root, "public/images/og-photo.jpg")).catch(() => null),
]);
const photoSrc = photo ? `data:image/jpeg;base64,${photo.toString("base64")}` : null;

// The finished card is also made once, at module evaluation: work awaited inside the handler would
// make the route render per request instead of being prerendered.
const card = await sharp(Buffer.from(await render().arrayBuffer()))
  .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:4:4" })
  .toBuffer();

export default function Image() {
  return new Response(new Uint8Array(card), { headers: { "Content-Type": contentType } });
}

function render() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", backgroundColor: "#F4EDE2" }}>
        {photoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoSrc}
            alt=""
            width={1200}
            height={630}
            style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            backgroundImage:
              "linear-gradient(90deg, rgba(244,237,226,0.98) 0%, rgba(244,237,226,0.94) 46%, rgba(244,237,226,0.15) 80%, rgba(244,237,226,0) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: 980,
            height: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", fontFamily: "Geist", fontSize: 44, letterSpacing: -1.8 }}>
            <span style={{ color: "#0B1438" }}>Aut</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LENS_MARK} alt="" width={34} height={34} style={{ margin: "12px 0 0 1px" }} />
            <span style={{ color: "#1A47D1", marginLeft: -3 }}>Lens</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexWrap: "wrap", fontFamily: "Cormorant", fontSize: 86, lineHeight: 1.0, color: "#121A36", letterSpacing: -2 }}>
              <span>Don&apos;t buy a vehicle&nbsp;</span>
              <span>without&nbsp;</span>
              <span style={{ fontStyle: "italic", color: "#1A47D1" }}>PDI.</span>
            </div>
            <div style={{ display: "flex", marginTop: 28, fontFamily: "Geist", fontSize: 22, color: "#4F5468" }}>
              Expert computerized car & bike diagnosis before delivery.
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontFamily: "Geist", fontSize: 17, color: "#4F5468" }}>
            <span style={{ letterSpacing: 2.6, whiteSpace: "nowrap" }}>PRE-DELIVERY INSPECTION | CONSULTATION</span>
            <span style={{ marginLeft: 32, whiteSpace: "nowrap", color: "#121A36" }}>{site.contact.phoneDisplay}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: serif, weight: 500, style: "normal" },
        { name: "Cormorant", data: serifItalic, weight: 500, style: "italic" },
        { name: "Geist", data: sans, weight: 500, style: "normal" },
      ],
    },
  );
}
