export interface PublicEnv {
  siteUrl: string;
  sanityProjectId: string | null;
  sanityDataset: string;
  sanityApiVersion: string;
  cookieConsentEnabled: boolean;
}

export const publicEnv: PublicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://floraohio.com",
  sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || null,
  sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  sanityApiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-07-11",
  cookieConsentEnabled: process.env.NEXT_PUBLIC_ENABLE_COOKIE_CONSENT === "true",
};

export function buildSanityImageUrlFromRef(assetRef: string): string | null {
  if (!publicEnv.sanityProjectId) return null;

  const match = assetRef.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  if (!match) return null;

  const [, hash, dims, ext] = match;
  return `https://cdn.sanity.io/images/${publicEnv.sanityProjectId}/${publicEnv.sanityDataset}/${hash}-${dims}.${ext}`;
}
