import type { Metadata, Viewport } from "next";
import { cormorantGaramond, inter } from "@/lib/fonts";
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

// Tint the browser chrome to the canonical olive — the dark brand otherwise
// sits under a default-light address bar on mobile
export const viewport: Viewport = {
  themeColor: "#242820",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <noscript>
          <style>{`[data-animate],[data-form-animate],[data-contact-animate],[data-about-animate],[data-site-header],.folio-reveal,.folio-reveal-label{opacity:1!important;visibility:visible!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="grain-overlay bg-background font-body text-text antialiased">
        {children}
      </body>
    </html>
  );
}
