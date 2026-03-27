import { buildSanityImageUrlFromRef } from "@/lib/public-env";
import type { SanityImage } from "@/types/project";

export function getImageDimensions(img?: SanityImage | null) {
  const match = img?.asset?._ref?.match(/-(\d+)x(\d+)-/);
  return match ? { width: +match[1], height: +match[2] } : null;
}

export function resolveImageUrl(img?: SanityImage | null): string | null {
  if (!img) return null;
  if (img.url) return img.url;
  // Handle dereferenced asset (from GROQ `asset->`)
  if (img.asset?.url) return img.asset.url;
  // Convert _ref: "image-{hash}-{dims}-{ext}" → "{hash}-{dims}.{ext}"
  if (img.asset?._ref) {
    return buildSanityImageUrlFromRef(img.asset._ref);
  }
  return null;
}
