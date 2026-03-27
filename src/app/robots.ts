import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/public-env";

const SITE_URL = publicEnv.siteUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/studio/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
