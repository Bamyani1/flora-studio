import type { Metadata } from "next";
import { publicEnv } from "@/lib/public-env";

const SITE_NAME = "Bahar Studio";
const SITE_URL = publicEnv.siteUrl;

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Photography that's worth keeping`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Photography studio based in Dayton, Ohio. Milestones, gatherings, motion, portraits, and professional photography with intention.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** JSON-LD: LocalBusiness — for the home page */
export function localBusinessJsonLd(sameAs: string[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    description:
      "Photography studio based in Dayton, Ohio. Milestones, gatherings, motion, portraits, and professional photography with intention.",
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    sameAs,
  };
}

/** JSON-LD: ImageGallery — for album pages */
export function imageGalleryJsonLd(album: {
  title: string;
  description?: string;
  slug: string;
  imageCount: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: album.title,
    description: album.description,
    url: `${SITE_URL}/work/${album.slug}`,
    numberOfItems: album.imageCount,
    provider: {
      "@type": "LocalBusiness",
      name: SITE_NAME,
    },
  };
}

/** JSON-LD: Person — for the about page */
export function personJsonLd({
  name = "Mostafa Bamyani",
  jobTitle = "Photographer & Designer",
  sameAs = [],
}: {
  name?: string;
  jobTitle?: string;
  sameAs?: string[];
} = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    url: `${SITE_URL}/about`,
    sameAs,
  };
}

/** JSON-LD: BreadcrumbList — for interior pages */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
