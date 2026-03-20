import manifest from "../../public/image-manifest.json";

type ManifestEntry = { blurDataURL: string; width: number; height: number };
const data = manifest as Record<string, ManifestEntry>;

export function getLocalBlur(path: string): string | undefined {
  return data[path]?.blurDataURL;
}
