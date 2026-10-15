import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/links";

// Fixed date keeps the route fully static; bump it when the content changes.
const LAST_UPDATED = "2026-10-15";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl(), lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 1 }];
}
