import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.brand.name}: Pre-Delivery Inspection & Vehicle Consultancy`,
    short_name: site.brand.name,
    description: site.seo.description,
    start_url: "/",
    display: "browser",
    background_color: "#f4ede2",
    theme_color: "#f4ede2",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
