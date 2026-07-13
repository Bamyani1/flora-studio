import { Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";

// The italic cut is the display voice of the site — without style: "italic"
// browsers synthesize a sheared roman, which flattens Cormorant's calligraphic
// drawing. 600 was unused; the weights below are the ones actually rendered.
export const cormorantGaramond = Cormorant_Garamond({
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
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
