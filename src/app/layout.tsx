import type { Metadata } from "next";
import { instrumentSerif, satoshi, jetbrainsMono } from "@/lib/fonts";
import { baseMetadata } from "@/lib/metadata";
import { Providers } from "@/providers/Providers";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { TransitionOverlay } from "@/components/layout/TransitionOverlay";
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
      className={`${instrumentSerif.variable} ${satoshi.variable} ${jetbrainsMono.variable}`}
    >
      <body className="grain-overlay bg-background font-body text-text antialiased">
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-background focus:outline-none"
          >
            Skip to content
          </a>
          <Header />
          <MobileMenu />
          {children}
          <Footer />
          <BackToTop />
          <TransitionOverlay />
        </Providers>
      </body>
    </html>
  );
}
