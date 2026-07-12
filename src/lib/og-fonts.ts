import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Satori can't use the site's next/font pipeline, so the share cards load the
// brand faces (Cormorant Garamond italic + Inter) from bundled woff assets.
// fs + fileURLToPath instead of fetch(): Node fetch can't read file: URLs
// during build-time prerender.
export async function loadOgBrandFonts() {
  const [display, label] = await Promise.all([
    readFile(
      fileURLToPath(new URL("../assets/og/cormorant-garamond-500-italic.woff", import.meta.url)),
    ),
    readFile(fileURLToPath(new URL("../assets/og/inter-500-normal.woff", import.meta.url))),
  ]);

  return [
    {
      name: "Cormorant Garamond",
      data: display.buffer.slice(display.byteOffset, display.byteOffset + display.byteLength) as ArrayBuffer,
      style: "italic" as const,
      weight: 500 as const,
    },
    {
      name: "Inter",
      data: label.buffer.slice(label.byteOffset, label.byteOffset + label.byteLength) as ArrayBuffer,
      style: "normal" as const,
      weight: 500 as const,
    },
  ];
}
