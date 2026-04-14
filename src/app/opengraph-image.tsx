import { ImageResponse } from "next/og";

export const alt = "Flora Studio | Photography that's worth keeping";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          fontSize: 64,
          fontWeight: 300,
          letterSpacing: "0.15em",
          lineHeight: 1,
        }}
      >
        FLORA STUDIO
      </div>
      <div
        style={{
          fontSize: 16,
          marginTop: 40,
          color: "#8B7355",
        }}
      >
        Photography that&apos;s worth keeping
      </div>
    </div>,
    { ...size },
  );
}
