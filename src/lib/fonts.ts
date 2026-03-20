import localFont from "next/font/local";

export const berlingskeSerif = localFont({
  src: [
    { path: "../../public/fonts/BerlingskeSerif-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/BerlingskeSerif-Regular.woff2", weight: "400", style: "normal" },
  ],
  display: "swap",
  variable: "--font-display",
  adjustFontFallback: false,
});

export const inter = localFont({
  src: "../../public/fonts/InterVariable.woff2",
  display: "swap",
  variable: "--font-body",
  weight: "100 900",
  adjustFontFallback: false,
});
