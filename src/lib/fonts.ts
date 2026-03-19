import { Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-display",
  preload: true,
});

export const satoshi = localFont({
  src: [
    { path: "../../public/fonts/Satoshi-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-body",
  preload: true,
});

export const jetbrainsMono = localFont({
  src: [
    { path: "../../public/fonts/JetBrainsMono-Regular.woff2", weight: "400", style: "normal" },
  ],
  display: "swap",
  variable: "--font-mono",
  preload: false,
});
