import fs from "fs";
import path from "path";
import sizeOf from "image-size";
import type { SanityImage } from "@/types/project";

function getAbsolutePublicPath(publicPath: string) {
  return path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
}

export function getImageDimensionsFromPublicPath(publicPath: string) {
  const buffer = fs.readFileSync(getAbsolutePublicPath(publicPath));
  const dims = sizeOf(buffer);

  return {
    width: dims.width ?? 2133,
    height: dims.height ?? 3200,
  };
}

export function localImage(
  imgPath: string,
  alt: string,
  width: number,
  height: number,
): SanityImage {
  return {
    _type: "image",
    asset: {
      _ref: `image-local-${width}x${height}-jpg`,
      _type: "reference",
    },
    alt,
    url: imgPath,
  };
}

export function localImageFromPublicPath(imgPath: string, alt: string): SanityImage {
  const { width, height } = getImageDimensionsFromPublicPath(imgPath);
  return localImage(imgPath, alt, width, height);
}

export function autoGallery(slug: string, altPrefix: string): SanityImage[] {
  const dir = path.join(process.cwd(), "public/images", slug);
  const files = fs.readdirSync(dir)
    .filter((file) => /^\d+\.jpg$/i.test(file))
    .sort();

  return files.map((file, index) =>
    localImageFromPublicPath(`/images/${slug}/${file}`, `${altPrefix} ${index + 1}`),
  );
}
