import type { MetadataRoute } from "next";
import { getAlbumSlugs } from "@/lib/albums";
import { publicEnv } from "@/lib/public-env";

const SITE_URL = publicEnv.siteUrl;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAlbumSlugs();
  // Build time is the honest freshness signal for a fully prerendered site —
  // lastModified is the field crawlers actually schedule against.
  const lastModified = new Date();

  const albumRoutes = slugs.map((s) => ({
    url: `${SITE_URL}/work/${s.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/work`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/process`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    ...albumRoutes,
  ];
}
