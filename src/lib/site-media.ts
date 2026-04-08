import type { SanityImage } from "@/types/project";

export const PLACEHOLDER_MEDIA_SRC = "placeholder://studio-bahar/media";
export const PLACEHOLDER_MEDIA_VIDEO_TOKEN = "placeholder://studio-bahar/video";
export const PLACEHOLDER_MEDIA_LABEL = "Media Placeholder";

interface PlaceholderImageOptions {
  alt?: string;
  key?: string;
  width?: number;
  height?: number;
}

function buildPlaceholderRef(width = 2400, height = 1600, key = "placeholder") {
  return `image-${key}-${width}x${height}-jpg`;
}

export function createPlaceholderImage({
  alt = PLACEHOLDER_MEDIA_LABEL,
  key = "placeholder",
  width = 2400,
  height = 1600,
}: PlaceholderImageOptions = {}): SanityImage {
  return {
    _type: "image",
    asset: {
      _ref: buildPlaceholderRef(width, height, key),
      _type: "reference",
    },
    alt,
    url: `${PLACEHOLDER_MEDIA_SRC}/${key}`,
  };
}
