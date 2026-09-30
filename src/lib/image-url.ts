import type { CSSProperties } from "react";
import { buildSanityImageUrlFromRef } from "@/lib/public-env";
import type { SanityImage } from "@/types/project";

export function getImageDimensions(img?: SanityImage | null) {
  const match = img?.asset?._ref?.match(/-(\d+)x(\d+)-/);
  return match ? { width: +match[1], height: +match[2] } : null;
}

/** width / height from the asset ref; `fallback` when the ref carries no usable size */
export function imageAspectRatio(img?: SanityImage | null, fallback = 3 / 2): number {
  const dims = getImageDimensions(img);
  return dims && dims.width > 0 && dims.height > 0 ? dims.width / dims.height : fallback;
}

// Keywords, numbers and units only: the value lands in an inline style attribute
const SAFE_POSITION = /^[a-z0-9.%\s-]+$/i;

function cleanPosition(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed && SAFE_POSITION.test(trimmed) ? trimmed : undefined;
}

function roundPercent(fraction: number): string {
  return `${Math.round(Math.min(1, Math.max(0, fraction)) * 1000) / 10}%`;
}

/** Crop focus for object-cover images: explicit Studio value, then hotspot, then center */
export function imagePositions(img?: SanityImage | null): { desktop: string; mobile: string } {
  const hotspot = img?.hotspot;
  const fromHotspot =
    hotspot && Number.isFinite(hotspot.x) && Number.isFinite(hotspot.y)
      ? `${roundPercent(hotspot.x)} ${roundPercent(hotspot.y)}`
      : undefined;
  const desktop = cleanPosition(img?.objectPosition) ?? fromHotspot ?? "50% 50%";
  return { desktop, mobile: cleanPosition(img?.mobileObjectPosition) ?? desktop };
}

/** Pair with IMAGE_POSITION_CLASS on the <img> */
export function imagePositionStyle(img?: SanityImage | null): CSSProperties {
  const { desktop, mobile } = imagePositions(img);
  return { "--pos": desktop, "--pos-mobile": mobile } as CSSProperties;
}

export const IMAGE_POSITION_CLASS = "object-[var(--pos-mobile)] md:object-[var(--pos)]";

/**
 * True only for genuine https://cdn.sanity.io URLs. This parses the URL and
 * compares the host exactly — a `startsWith("https://cdn.sanity.io")` prefix
 * check is defeated by "https://cdn.sanity.io.evil.com" (subdomain) and
 * "https://cdn.sanity.io@evil.com" (userinfo), both of which resolve to an
 * attacker host. Gate every server-side fetch/inline of an image URL on this
 * so a CMS-supplied `url` can never point the server at an arbitrary host.
 */
export function isSanityCdnUrl(url?: string | null): boolean {
  if (!url) return false;
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && hostname === "cdn.sanity.io";
  } catch {
    return false;
  }
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

export function normalizeImage(img?: SanityImage | null): SanityImage | null {
  if (!img) return null;

  const url = resolveImageUrl(img);

  return {
    ...img,
    url: url ?? undefined,
  };
}

export function normalizeImages(images?: (SanityImage | null | undefined)[] | null): SanityImage[] {
  if (!Array.isArray(images)) return [];

  return images
    .map((image) => normalizeImage(image))
    .filter((image): image is SanityImage => Boolean(image));
}
