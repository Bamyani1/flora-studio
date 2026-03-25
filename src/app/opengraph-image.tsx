import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Saffron Studios — Photography that's worth keeping";
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
      {/* Three Threads mark */}
      <svg width="80" height="80" viewBox="30 20 40 45" style={{ marginBottom: 32 }}>
        <rect
          x="38"
          y="42"
          width="24"
          height="20"
          rx="0.5"
          stroke="#c97b2a"
          strokeWidth="0.6"
          fill="none"
          opacity="0.45"
        />
        <path
          d="M50 56 C49 52, 46 48, 44 44 C42 40, 40 38, 39 34 C38.5 32, 38.5 31, 38 29"
          stroke="#c97b2a"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M50 56 C50 52, 50 48, 50 44 C50 40, 50 36, 50 32 C50 30, 50 28, 50 26"
          stroke="#c97b2a"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M50 56 C51 52, 54 48, 56 44 C58 40, 60 38, 61 34 C61.5 32, 61.5 31, 62 29"
          stroke="#c97b2a"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="50" cy="56" r="1.5" fill="#c97b2a" />
      </svg>
      <div
        style={{
          fontSize: 72,
          fontWeight: 400,
          letterSpacing: "0.12em",
          lineHeight: 1,
        }}
      >
        SAFFRON
      </div>
      <div
        style={{
          fontSize: 20,
          letterSpacing: "0.3em",
          marginTop: 16,
          color: "#F5F0EB",
        }}
      >
        STUDIOS
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
