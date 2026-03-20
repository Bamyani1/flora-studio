import type { SanityImage } from "@/types/project";

export function resolveImageUrl(img?: SanityImage | null): string | null {
  if (!img) return null;
  if (img.url) return img.url;
  // Handle dereferenced asset (from GROQ `asset->`)
  if (img.asset?.url) return img.asset.url;
  // Convert _ref: "image-{hash}-{dims}-{ext}" → "{hash}-{dims}.{ext}"
  if (img.asset?._ref) {
    const match = img.asset._ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
    if (match) {
      const [, hash, dims, ext] = match;
      return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/production/${hash}-${dims}.${ext}`;
    }
  }
  return null;
}
