import {
  Cormorant_Garamond,
  Playfair_Display,
  DM_Sans,
  EB_Garamond,
  IBM_Plex_Mono,
  Bodoni_Moda,
  Lexend,
  Instrument_Serif,
  Outfit,
  Newsreader,
  Karla,
  Noto_Serif,
  Space_Grotesk,
} from "next/font/google";
import localFont from "next/font/local";

export const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const inter = localFont({
  src: "../../public/fonts/InterVariable.woff2",
  display: "swap",
  variable: "--font-body",
  weight: "100 900",
  adjustFontFallback: false,
});

// ── Hero Variation Fonts ────────────────────────────

// V1: Overprint
export const playfairDisplay = Playfair_Display({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-v1-display",
  display: "swap",
});

export const dmSans = DM_Sans({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-v1-body",
  display: "swap",
});

// V2: Index
export const ebGaramond = EB_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-v2-display",
  display: "swap",
});

export const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-v2-body",
  display: "swap",
});

// V3: Vertical
export const bodoniModa = Bodoni_Moda({
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-v3-display",
  display: "swap",
});

export const lexend = Lexend({
  weight: ["300", "400"],
  subsets: ["latin"],
  variable: "--font-v3-body",
  display: "swap",
});

// V4: Marquee
export const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-v4-display",
  display: "swap",
});

export const outfit = Outfit({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-v4-body",
  display: "swap",
});

// V5: Manuscript
export const newsreader = Newsreader({
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-v5-display",
  display: "swap",
});

export const karla = Karla({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-v5-body",
  display: "swap",
});

// V6: Landing Hero Grid
export const notoSerif = Noto_Serif({
  weight: ["700", "900"],
  subsets: ["latin"],
  variable: "--font-noto-serif",
  display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
