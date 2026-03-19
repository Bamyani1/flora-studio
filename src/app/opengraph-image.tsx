import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Bamyan Storyworks — Cinematic Photography";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0C0F14",
          color: "#E8E8EC",
        }}
      >
        <div
          style={{
            width: 80,
            height: 1,
            backgroundColor: "#7B93B0",
            marginBottom: 32,
          }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 400,
            letterSpacing: "0.06em",
            lineHeight: 1,
          }}
        >
          BAMYAN
        </div>
        <div
          style={{
            fontSize: 20,
            letterSpacing: "0.3em",
            marginTop: 16,
            color: "#D4D4D8",
          }}
        >
          STORYWORKS
        </div>
        <div
          style={{
            fontSize: 16,
            marginTop: 40,
            color: "#64748B",
          }}
        >
          Cinematic photography for the stories that matter
        </div>
      </div>
    ),
    { ...size },
  );
}
