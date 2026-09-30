import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Allow phone testing against `next dev` over the LAN
  allowedDevOrigins: ["10.0.0.145"],
  images: {
    formats: ["image/avif", "image/webp"],
    // 2880 matches the hero source width — without it, 2x laptops round up to 3840
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920, 2560, 2880, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [85, 90, 95],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    // Only this project's Sanity assets: an open host lets anyone spend the
    // deployment's image-optimization quota on arbitrary images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
          ? `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**`
          : "/images/**",
      },
    ],
  },
};

export default nextConfig;
