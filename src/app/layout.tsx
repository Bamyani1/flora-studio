import type { Metadata } from "next";
import { cormorantGaramond, inter, notoSerif, spaceGrotesk, ebGaramond } from "@/lib/fonts";
import { baseMetadata } from "@/lib/metadata";
import { Providers } from "@/providers/Providers";
import { RouteChrome } from "@/components/layout/RouteChrome";
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
      <body className="grain-overlay bg-background font-body text-text antialiased">
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-background focus:outline-none"
          >
            Skip to content
          </a>
          <RouteChrome>{children}</RouteChrome>
        </Providers>
      </body>
    </html>
  );
}
