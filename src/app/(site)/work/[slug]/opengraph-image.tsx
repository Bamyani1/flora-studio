import { ImageResponse } from "next/og";
import { publicEnv } from "@/lib/public-env";

export const alt = "Studio Bahar photography album";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* ------------------------------------------------------------------ */
/*  Lightweight Sanity fetch — bypasses server-only client chain       */
/* ------------------------------------------------------------------ */

const OG_ALBUM_QUERY = `*[_type == "album" && slug.current == $slug][0]{
  title, description, heroImage, coverImage
}`;

interface OGAlbum {
  title?: string;
  description?: string;
  heroImage?: { asset?: { _ref?: string; url?: string }; url?: string };
  coverImage?: { asset?: { _ref?: string; url?: string }; url?: string };
}

async function fetchAlbumForOG(slug: string): Promise<OGAlbum | null> {
  const { sanityProjectId, sanityDataset, sanityApiVersion } = publicEnv;
  if (!sanityProjectId) return null;

  const token = process.env.SANITY_READ_TOKEN;
  const url = new URL(
    `https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/query/${sanityDataset}`,
  );
  url.searchParams.set("query", OG_ALBUM_QUERY);
  url.searchParams.set("$slug", `"${slug}"`);

  try {
    const res = await fetch(url.toString(), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.result as OGAlbum) ?? null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Image URL resolution (self-contained, no server-only imports)      */
/* ------------------------------------------------------------------ */

function resolveImageUrlFromRef(ref: string): string | null {
  const { sanityProjectId, sanityDataset } = publicEnv;
  if (!sanityProjectId) return null;
  const match = ref.match(/^image-(.+)-(\d+x\d+)-(\w+)$/);
  if (!match) return null;
  const [, hash, dims, ext] = match;
  return `https://cdn.sanity.io/images/${sanityProjectId}/${sanityDataset}/${hash}-${dims}.${ext}`;
}

function getImageUrl(album: OGAlbum): string | null {
  const img = album.heroImage ?? album.coverImage;
  if (!img) return null;
  if (img.url) return img.url;
  if (img.asset?.url) return img.asset.url;
  if (img.asset?._ref) return resolveImageUrlFromRef(img.asset._ref);
  return null;
}

/* ------------------------------------------------------------------ */
/*  OG Image handler                                                   */
/* ------------------------------------------------------------------ */

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const album = await fetchAlbumForOG(slug);
  const imageUrl = album ? getImageUrl(album) : null;
  const title = album?.title ?? "Album";

  // Photo-forward layout: full-bleed photo + gradient overlay
  if (imageUrl) {
    const sanityUrl = `${imageUrl}?w=1200&h=630&fit=crop&auto=format`;

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
          src={sanityUrl}
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
            height: "45%",
            background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            padding: "0 48px 40px",
          }}
        >
          <div
            style={{
              color: "#F5F0EB",
              fontSize: 48,
              fontWeight: 300,
              letterSpacing: "0.05em",
              lineHeight: 1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "#8B7355",
              fontSize: 14,
              letterSpacing: "0.2em",
              lineHeight: 1,
            }}
          >
            STUDIO BAHAR
          </div>
        </div>
      </div>,
      { ...size },
    );
  }

  // Text-only fallback (matches root OG image style)
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#121212",
        color: "#F5F0EB",
      }}
    >
      <div
        style={{
          fontSize: 48,
          fontWeight: 300,
          letterSpacing: "0.1em",
          lineHeight: 1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 16,
          marginTop: 40,
          color: "#8B7355",
        }}
      >
        STUDIO BAHAR
      </div>
    </div>,
    { ...size },
  );
}
