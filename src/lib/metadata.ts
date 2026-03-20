import type { Metadata } from "next";

const SITE_NAME = "Silk Studio";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://silkstudio.com";

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Cinematic photography for the stories that matter`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Cinematic photography studio specializing in landscape, night sky, sports, portrait, and travel photography.",
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
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    description:
      "Cinematic photography studio specializing in landscape, night sky, sports, portrait, and travel photography.",
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    sameAs: [
      "https://instagram.com/silkstudio",
      "https://behance.net/silkstudio",
      "https://linkedin.com/company/silkstudio",
    ],
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
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Silk Studio",
    jobTitle: "Photographer & Visual Storyteller",
    url: `${SITE_URL}/about`,
    sameAs: [
      "https://instagram.com/silkstudio",
      "https://behance.net/silkstudio",
      "https://linkedin.com/company/silkstudio",
    ],
  };
}
