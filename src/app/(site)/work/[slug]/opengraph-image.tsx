import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getAlbumBySlug } from "@/lib/albums";
import { resolveImageUrl, isSanityCdnUrl } from "@/lib/image-url";
import { loadOgBrandFonts } from "@/lib/og-fonts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Per-album alt text on the share card ("The Graduate — Flora Studio")
export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  const title = album?.title ?? "Flora Studio";

  return [{ id: "og", size, alt: `${title} — Flora Studio`, contentType }];
}

// Resolve the album's hero to something satori can render: Sanity CDN URLs get
// crop params; local-content paths (public/images/...) are inlined as data URIs
// because the OG renderer has no origin to resolve relative URLs against.
async function loadHeroSrc(url: string | null): Promise<string | null> {
  if (!url) return null;

  if (url.startsWith("http")) {
    // Only ever fetch from the Sanity CDN. Passing an arbitrary CMS-supplied
    // URL straight to satori's <img> would let a stored `url` field point the
    // renderer's server-side fetch at any host (SSRF); reject anything else.
    return isSanityCdnUrl(url) ? `${url}?w=1200&h=630&fit=crop&auto=format` : null;
  }

  try {
    const file = await readFile(path.join(process.cwd(), "public", url));
    const ext = path.extname(url).slice(1).toLowerCase();
    const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return `data:${mime};base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Same content source as the page itself — a separate raw fetch here used to
  // silently fail outside Sanity mode and ship a generic "Album" card.
  const album = await getAlbumBySlug(slug);
  const title = album?.title ?? "Flora Studio";
  const heroSrc = await loadHeroSrc(resolveImageUrl(album?.heroImage ?? album?.coverImage));
  const fonts = await loadOgBrandFonts();

  // Photo-forward layout: full-bleed hero + gradient scrim
  if (heroSrc) {
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
        }}
      >
        <img
          src={heroSrc}
          width={1200}
          height={630}
          alt=""
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(to top, rgba(36,40,32,0.9), transparent)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            padding: "0 56px 44px",
          }}
        >
          <div
            style={{
              fontFamily: '"Cormorant Garamond"',
              fontStyle: "italic",
              color: "#e8dfd4",
              fontSize: 60,
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: "Inter",
              color: "#c97b2a",
              fontSize: 15,
              letterSpacing: "0.25em",
              lineHeight: 1,
              paddingBottom: 8,
            }}
          >
            FLORA STUDIO
          </div>
        </div>
      </div>,
      { ...size, fonts },
    );
  }

  // Text-only fallback — still carries the real album title and brand type
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#242820",
      }}
    >
      <div
        style={{
          fontFamily: '"Cormorant Garamond"',
          fontStyle: "italic",
          fontSize: 72,
          fontWeight: 500,
          color: "#e8dfd4",
          lineHeight: 1,
        }}
      >
        {title}
      </div>
      <div style={{ width: 64, height: 1, backgroundColor: "#c97b2a", marginTop: 36 }} />
      <div
        style={{
          fontFamily: "Inter",
          fontSize: 15,
          letterSpacing: "0.25em",
          marginTop: 30,
          color: "#c97b2a",
        }}
      >
        FLORA STUDIO
      </div>
    </div>,
    { ...size, fonts },
  );
}
