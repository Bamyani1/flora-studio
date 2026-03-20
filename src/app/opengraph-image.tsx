import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Silk Road Studio — Cinematic Photography";
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
          backgroundColor: "#121212",
          color: "#F5F0EB",
        }}
      >
        <div
          style={{
            width: 80,
            height: 1,
            backgroundColor: "#C4973B",
            marginBottom: 32,
          }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 400,
            letterSpacing: "0.12em",
            lineHeight: 1,
          }}
        >
          SILK ROAD
        </div>
        <div
          style={{
            fontSize: 20,
            letterSpacing: "0.3em",
            marginTop: 16,
            color: "#F5F0EB",
          }}
        >
          STUDIO
        </div>
        <div
          style={{
            fontSize: 16,
            marginTop: 40,
            color: "#8B7355",
          }}
        >
          Cinematic photography for the stories that matter
        </div>
      </div>
    ),
    { ...size },
  );
}
