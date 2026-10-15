/**
 * Static imports of every photograph. Next.js reads width, height and a blur placeholder
 * at build time and gives each file a content-hashed URL, so replacing an image and
 * redeploying always busts the cache. Replace files with `npm run images` (see README).
 */
import heroDesktop from "@/public/images/hero-desktop.webp";
import heroMobile from "@/public/images/hero-mobile.webp";
import lensCar from "@/public/images/lens-car.webp";
import lensBike from "@/public/images/lens-bike.webp";
import diagnosticTablet from "@/public/images/diagnostic-tablet.webp";
import paintGauge from "@/public/images/paint-gauge.webp";
import handover from "@/public/images/handover.webp";
import bikeInspection from "@/public/images/bike-inspection.webp";
import detailVinTyre from "@/public/images/detail-vin-tyre.webp";
import ctaBg from "@/public/images/cta-bg.webp";

export const images = {
  heroDesktop,
  heroMobile,
  lensCar,
  lensBike,
  diagnosticTablet,
  paintGauge,
  handover,
  bikeInspection,
  detailVinTyre,
  ctaBg,
};

export type ImageKey = keyof typeof images;
