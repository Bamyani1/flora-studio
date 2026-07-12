import type { MetadataRoute } from "next";
import { getAlbumSlugs } from "@/lib/albums";
import { publicEnv } from "@/lib/public-env";

const SITE_URL = publicEnv.siteUrl;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAlbumSlugs();

  const albumRoutes = slugs.map((s) => ({
    url: `${SITE_URL}/work/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/work`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/process`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    ...albumRoutes,
  ];
}
