import Link from "next/link";
import {
  playfairDisplay,
  dmSans,
  ebGaramond,
  ibmPlexMono,
  bodoniModa,
  lexend,
  instrumentSerif,
  outfit,
  newsreader,
  karla,
} from "@/lib/fonts";

export const metadata = {
  title: "Hero Variations — Saffron Studios",
};

const HEROES = [
  {
    slug: "overprint",
    number: "01",
    name: "Overprint",
    descriptor: "Layered type collision",
    fontVar: "--font-v1-display",
  },
  {
    slug: "frame",
    number: "02",
    name: "The Frame",
    descriptor: "Double-exposure layering",
    fontVar: "--font-v2-display",
  },
  {
    slug: "monolith",
    number: "03",
    name: "Monolith",
    descriptor: "Text as image window",
    fontVar: "--font-v3-display",
  },
  {
    slug: "parallax",
    number: "04",
    name: "Parallax",
    descriptor: "Multi-depth floating layers",
    fontVar: "--font-v4-display",
  },
  {
    slug: "negative",
    number: "05",
    name: "Negative",
    descriptor: "Film strip hero",
    fontVar: "--font-v5-display",
  },
  {
    slug: "diptych",
    number: "06",
    name: "Diptych",
    descriptor: "Asymmetric split-screen",
    fontVar: "--font-display",
  },
  {
    slug: "exposure",
    number: "07",
    name: "Exposure",
    descriptor: "Double-exposed through film gate",
    fontVar: "--font-v2-display",
  },
  {
    slug: "reel",
    number: "08",
    name: "Reel",
    descriptor: "Vertical strip with diagonal type",
    fontVar: "--font-v3-display",
  },
  {
    slug: "projection",
    number: "09",
    name: "Projection",
    descriptor: "Projector beam with type in darkness",
    fontVar: "--font-v1-display",
  },
  {
    slug: "contact",
    number: "10",
    name: "Contact",
    descriptor: "Proof grid with ghost text",
    fontVar: "--font-v4-display",
  },
  {
    slug: "splice",
    number: "11",
    name: "Splice",
    descriptor: "Split film strip with text gap",
    fontVar: "--font-v5-display",
  },
] as const;

const fontClasses = [
  playfairDisplay.variable,
  dmSans.variable,
  ebGaramond.variable,
  ibmPlexMono.variable,
  bodoniModa.variable,
  lexend.variable,
  instrumentSerif.variable,
  outfit.variable,
  newsreader.variable,
  karla.variable,
].join(" ");

export default function HeroesPage() {
  return (
    <div
      className={`${fontClasses} min-h-screen flex flex-col items-center justify-center px-6 py-16`}
      style={{ backgroundColor: "var(--color-surface-deep)" }}
    >
      {/* Title */}
      <h1
        className="font-display"
        style={{
          fontSize: 11,
          fontWeight: 300,
          letterSpacing: "0.35em",
          color: "var(--color-primary)",
          textTransform: "uppercase",
        }}
      >
        Hero Variations
      </h1>

      {/* Subtitle */}
      <p
        className="font-body mt-3"
        style={{
          fontSize: 13,
          fontWeight: 300,
          color: "color-mix(in srgb, var(--color-text) 40%, transparent)",
        }}
      >
        Eleven approaches to the Saffron Studios landing
      </p>

      {/* Grid */}
      <div
        className="grid grid-cols-2 lg:grid-cols-3 mt-16 w-full"
        style={{ maxWidth: 960, gap: 20 }}
      >
        {HEROES.map((hero) => (
          <Link
            key={hero.slug}
            href={`/heroes/${hero.slug}`}
            className="group relative flex flex-col justify-between transition-all duration-400 hover:scale-[1.015] hover:border-primary"
            style={{
              aspectRatio: "16 / 10",
              backgroundColor: "var(--color-background)",
              border: "1px solid var(--color-surface)",
              padding: 20,
            }}
          >
            {/* Number */}
            <span
              className="font-body"
              style={{
                fontSize: 10,
                fontWeight: 400,
                color: "var(--color-primary)",
              }}
            >
              {hero.number}
            </span>

            {/* Name */}
            <span
              className="self-center"
              style={{
                fontFamily: `var(${hero.fontVar})`,
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontWeight: 400,
                color: "var(--color-text-heading)",
              }}
            >
              {hero.name}
            </span>

            {/* Descriptor */}
            <span
              className="font-body self-end"
              style={{
                fontSize: 9,
                fontWeight: 300,
                letterSpacing: "0.1em",
                color: "color-mix(in srgb, var(--color-text) 30%, transparent)",
                textTransform: "uppercase",
              }}
            >
              {hero.descriptor}
            </span>
          </Link>
        ))}
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="font-body mt-16 transition-colors duration-300 hover:text-primary"
        style={{
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: "0.1em",
          color: "color-mix(in srgb, var(--color-text) 30%, transparent)",
        }}
      >
        &larr; BACK TO SITE
      </Link>
    </div>
  );
}
