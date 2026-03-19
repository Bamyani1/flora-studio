import type { Metadata } from "next";
import { instrumentSerif, satoshi, jetbrainsMono } from "@/lib/fonts";
import { Providers } from "@/providers/Providers";
import { TransitionOverlay } from "@/components/layout/TransitionOverlay";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Bamyan Storyworks — Photography for moments that matter",
  description:
    "Cinematic photography studio specializing in personal, event, sports, and solo photography.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bamyanstoryworks.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${satoshi.variable} ${jetbrainsMono.variable}`}
    >
      <body className="grain-overlay bg-background font-body text-text antialiased">
        <Providers>
          {children}
          <TransitionOverlay />
        </Providers>
      </body>
    </html>
  );
}
