import type { Metadata } from "next";
import { publicEnv } from "@/lib/public-env";

const SITE_NAME = "Flora Studio";
const SITE_URL = publicEnv.siteUrl;

export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "./",
  },
  title: {
    default: `${SITE_NAME} | Photography that's worth keeping`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Photography studio based in Dayton, Ohio. Weddings and graduations, events, sports, portraits, and commercial photography with intention.",
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

// A stable @id lets Person/ImageGallery reference the business so the JSON-LD
// forms one graph instead of disconnected nodes
const BUSINESS_ID = `${SITE_URL}/#business`;

/** JSON-LD: LocalBusiness — for the home page. Address/geo/telephone are the
 *  signals local search actually uses; the copy leans on "Dayton, Ohio"
 *  everywhere, so the schema should too. */
export function localBusinessJsonLd(
  sameAs: string[] = [],
  contact?: { email?: string; telephone?: string },
) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    name: SITE_NAME,
    description:
      "Photography studio based in Dayton, Ohio. Weddings and graduations, events, sports, portraits, and commercial photography with intention.",
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    logo: `${SITE_URL}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dayton",
      addressRegion: "OH",
      addressCountry: "US",
    },
    areaServed: "Dayton, Ohio",
    ...(contact?.email ? { email: contact.email } : {}),
    ...(contact?.telephone ? { telephone: contact.telephone } : {}),
    sameAs,
  };
}

/** JSON-LD: ImageGallery — for album pages. associatedMedia lists the actual
 *  photographs so image search has objects to surface, not just a count. */
export function imageGalleryJsonLd(album: {
  title: string;
  description?: string;
  slug: string;
  imageCount: number;
  images?: { url: string; caption?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: album.title,
    description: album.description,
    url: `${SITE_URL}/work/${album.slug}`,
    numberOfItems: album.imageCount,
    ...(album.images && album.images.length > 0
      ? {
          associatedMedia: album.images.map((image) => ({
            "@type": "ImageObject",
            contentUrl: image.url.startsWith("http") ? image.url : `${SITE_URL}${image.url}`,
            ...(image.caption ? { caption: image.caption } : {}),
          })),
        }
      : {}),
    provider: {
      "@type": "LocalBusiness",
      "@id": BUSINESS_ID,
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
    worksFor: {
      "@type": "LocalBusiness",
      "@id": BUSINESS_ID,
      name: SITE_NAME,
    },
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
