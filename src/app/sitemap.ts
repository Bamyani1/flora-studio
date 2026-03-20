import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { ALBUM_SLUGS_QUERY } from "@/sanity/queries";
import { PLACEHOLDER_ALL_ALBUMS } from "@/lib/placeholder-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://silkstudio.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let slugs: { slug: string }[] = [];
  try {
    slugs = await client.fetch(ALBUM_SLUGS_QUERY);
  } catch {
    slugs = PLACEHOLDER_ALL_ALBUMS.map((a) => ({ slug: a.slug.current }));
  }

  const albumRoutes = slugs.map((s) => ({
    url: `${SITE_URL}/work/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/work`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/process`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...albumRoutes,
  ];
}
