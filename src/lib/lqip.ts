import "server-only";

import { existsSync } from "fs";
import { join, sep } from "path";
import { isSanityCdnUrl } from "@/lib/image-url";

export async function generateLqipDataUrl(
  imageUrl: string | null | undefined,
): Promise<string | undefined> {
  if (!isSanityCdnUrl(imageUrl)) return undefined;

  const lqipUrl = `${imageUrl}?w=20&blur=50&q=30&fit=crop&auto=format`;

  try {
    const response = await fetch(lqipUrl, { signal: AbortSignal.timeout(2000) });
    if (!response.ok) return undefined;

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch {
    return undefined;
  }
}

/** Blur placeholder for a Sanity CDN url or a local /public path */
export async function generateBlurDataUrl(
  imageUrl: string | null | undefined,
): Promise<string | undefined> {
  if (isSanityCdnUrl(imageUrl)) return generateLqipDataUrl(imageUrl);
  if (imageUrl?.startsWith("/")) return generateLocalLqipDataUrl(imageUrl);
  return undefined;
}

export async function generateLocalLqipDataUrl(
  publicPath: string | null | undefined,
): Promise<string | undefined> {
  if (!publicPath) return undefined;

  const publicDir = join(process.cwd(), "public");
  const absolutePath = join(publicDir, publicPath.replace(/^\//, ""));
  // A CMS-supplied "/../" path must not read files outside public/
  if (!absolutePath.startsWith(publicDir + sep) || !existsSync(absolutePath)) return undefined;

  try {
    const sharp = (await import("sharp")).default;
    const buffer = await sharp(absolutePath).resize(20).blur(10).jpeg({ quality: 30 }).toBuffer();
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  } catch {
    return undefined;
  }
}
