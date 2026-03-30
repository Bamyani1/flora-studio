import type { Metadata } from "next";
import { cormorantGaramond, inter, notoSerif, spaceGrotesk, ebGaramond } from "@/lib/fonts";
import { baseMetadata } from "@/lib/metadata";
import "@/styles/globals.css";

export const metadata: Metadata = {
  ...baseMetadata,
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${inter.variable} ${notoSerif.variable} ${spaceGrotesk.variable} ${ebGaramond.variable}`}
    >
      <body className="grain-overlay bg-background font-body text-text antialiased">{children}</body>
    </html>
  );
}
