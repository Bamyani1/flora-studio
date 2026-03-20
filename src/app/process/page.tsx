import type { Metadata } from "next";
import { getLocalBlur } from "@/lib/image-manifest";
import { ProcessExperience } from "@/components/process-reference/ProcessExperience";
import type { ProcessStep } from "@/components/process-reference/types";

export const metadata: Metadata = {
  title: "Process",
  description:
    "From ideation to curation — discover the methodology behind Silk Road Studio. Four phases that transform fleeting moments into deliberate, exhibition-grade compositions.",
};

const STEPS: ProcessStep[] = [
  {
    id: "01",
    title: "Ideation & Scope",
    description:
      "Every project begins with deep listening. We immerse ourselves in the narrative — understanding the people, the space, the light — before a single frame is composed. Research, mood boards, and location scouting build the visual language.",
    meta: "Phase: Narrative Design",
    images: [
      {
        src: "/images/high-country/01.jpg",
        alt: "Misty mountain landscape in the ideation phase",
        blurDataURL: getLocalBlur("/images/high-country/01.jpg"),
      },
    ],
    layout: "single",
    align: "left",
  },
  {
    id: "02",
    title: "Light Architecture",
    description:
      "Light is the medium. We design each scene's illumination with cinematic precision — whether chasing golden hour on location or building complex studio setups. Every shadow is intentional, every highlight placed.",
    metaList: ["Volumetric Grading", "High-Contrast Scoping"],
    images: [
      {
        src: "/images/after-dark/01.jpg",
        alt: "Night landscape used to illustrate light architecture",
        blurDataURL: getLocalBlur("/images/after-dark/01.jpg"),
      },
    ],
    layout: "bordered",
    align: "right",
  },
  {
    id: "03",
    title: "The Decisive Moment",
    description:
      "Preparation meets intuition. With the vision clear and the light set, we enter the space of pure attention — ready for the convergence of gesture, expression, and atmosphere that makes a photograph transcend documentation.",
    meta: "The Lens Phase",
    images: [
      {
        src: "/images/wanderlust/02.jpg",
        alt: "Wide cinematic frame capturing the decisive moment",
        blurDataURL: getLocalBlur("/images/wanderlust/02.jpg"),
      },
    ],
    layout: "ultrawide",
    align: "left",
  },
  {
    id: "04",
    title: "Curation",
    description:
      "From hundreds of exposures, we distill the essential. Each selected frame is developed with meticulous attention to tone, contrast, and mood — ensuring the final collection tells a cohesive, emotionally resonant story.",
    images: [
      {
        src: "/images/golden-hour/01.jpg",
        alt: "Golden hour portrait selected during curation",
        blurDataURL: getLocalBlur("/images/golden-hour/01.jpg"),
      },
      {
        src: "/images/golden-hour/02.jpg",
        alt: "Second golden hour portrait from the curated edit",
        blurDataURL: getLocalBlur("/images/golden-hour/02.jpg"),
      },
      {
        src: "/images/graduation/01.jpg",
        alt: "Graduation portrait from the final curated set",
        blurDataURL: getLocalBlur("/images/graduation/01.jpg"),
      },
      {
        src: "/images/graduation/02.jpg",
        alt: "Additional graduation portrait from the curated edit",
        blurDataURL: getLocalBlur("/images/graduation/02.jpg"),
      },
    ],
    layout: "grid",
    align: "right",
    action: { label: "View Journal", href: "/work" },
  },
];

export default function ProcessPage() {
  return (
    <ProcessExperience
      heroImage={{
        src: "/images/out-west/hero.jpg",
        alt: "Cinematic mountain landscape hero image for Silk Road Studio",
        blurDataURL: getLocalBlur("/images/out-west/hero.jpg"),
      }}
      portraitImage={{
        src: "/images/portrait.jpg",
        alt: "Portrait of the Silk Road Studio photographer",
        blurDataURL: getLocalBlur("/images/portrait.jpg"),
      }}
      steps={STEPS}
      quote="We don't chase images that only look beautiful. We build photographs with atmosphere, restraint, and narrative precision so they continue to resonate after the moment has passed."
    />
  );
}
