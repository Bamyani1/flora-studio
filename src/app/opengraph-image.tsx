import { ImageResponse } from "next/og";
import { loadOgBrandFonts } from "@/lib/og-fonts";

export const alt = "Flora Studio | Photography that's worth keeping";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const fonts = await loadOgBrandFonts();

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
          fontSize: 96,
          fontWeight: 500,
          color: "#e8dfd4",
          lineHeight: 1,
        }}
      >
        Flora Studio
      </div>
      <div style={{ width: 64, height: 1, backgroundColor: "#c97b2a", marginTop: 40 }} />
      <div
        style={{
          fontFamily: "Inter",
          fontSize: 17,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#e8dfd4",
          opacity: 0.78,
          marginTop: 32,
        }}
      >
        Photography that&apos;s worth keeping
      </div>
    </div>,
    { ...size, fonts },
  );
}
