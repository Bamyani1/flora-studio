import { notFound } from "next/navigation";
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
import { HeroOverprint } from "@/components/heroes/HeroOverprint";
import { HeroFrame } from "@/components/heroes/HeroFrame";
import { HeroMonolith } from "@/components/heroes/HeroMonolith";
import { HeroParallax } from "@/components/heroes/HeroParallax";
import { HeroNegative } from "@/components/heroes/HeroNegative";
import { HeroDiptych } from "@/components/heroes/HeroDiptych";
import { HeroExposure } from "@/components/heroes/HeroExposure";
import { HeroReel } from "@/components/heroes/HeroReel";
import { HeroProjection } from "@/components/heroes/HeroProjection";
import { HeroContact } from "@/components/heroes/HeroContact";
import { HeroSplice } from "@/components/heroes/HeroSplice";

const HERO_REGISTRY: Record<
  string,
  { Component: React.ComponentType; fonts: string; title: string }
> = {
  overprint: {
    Component: HeroOverprint,
    fonts: [playfairDisplay.variable, dmSans.variable].join(" "),
    title: "Overprint",
  },
  frame: {
    Component: HeroFrame,
    fonts: [ebGaramond.variable, ibmPlexMono.variable].join(" "),
    title: "The Frame",
  },
  monolith: {
    Component: HeroMonolith,
    fonts: [bodoniModa.variable, lexend.variable].join(" "),
    title: "Monolith",
  },
  parallax: {
    Component: HeroParallax,
    fonts: [instrumentSerif.variable, outfit.variable].join(" "),
    title: "Parallax",
  },
  negative: {
    Component: HeroNegative,
    fonts: [newsreader.variable, karla.variable].join(" "),
    title: "Negative",
  },
  diptych: {
    Component: HeroDiptych,
    fonts: "",
    title: "Diptych",
  },
  exposure: {
    Component: HeroExposure,
    fonts: [ebGaramond.variable, ibmPlexMono.variable].join(" "),
    title: "Exposure",
  },
  reel: {
    Component: HeroReel,
    fonts: [bodoniModa.variable, lexend.variable].join(" "),
    title: "Reel",
  },
  projection: {
    Component: HeroProjection,
    fonts: [playfairDisplay.variable, dmSans.variable].join(" "),
    title: "Projection",
  },
  contact: {
    Component: HeroContact,
    fonts: [instrumentSerif.variable, outfit.variable].join(" "),
    title: "Contact",
  },
  splice: {
    Component: HeroSplice,
    fonts: [newsreader.variable, karla.variable].join(" "),
    title: "Splice",
  },
};

export function generateStaticParams() {
  return Object.keys(HERO_REGISTRY).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const hero = HERO_REGISTRY[slug];
    return {
      title: hero
        ? `${hero.title} — Hero Variations — Silk Road Studio`
        : "Hero Variations",
    };
  });
}

export default async function HeroPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hero = HERO_REGISTRY[slug];
  if (!hero) notFound();

  const { Component, fonts } = hero;

  return (
    <main id="main-content" className={fonts || undefined}>
      <Component />

      {/* Back link — fades in after hero animation */}
      <Link
        href="/heroes"
        className="fixed top-6 left-6 z-50 font-body transition-colors duration-300 hover:text-primary"
        style={{
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: "0.1em",
          color: "color-mix(in srgb, var(--color-text) 35%, transparent)",
          animation: "fadeIn 0.5s ease 3s both",
        }}
      >
        &larr; VARIATIONS
      </Link>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </main>
  );
}
