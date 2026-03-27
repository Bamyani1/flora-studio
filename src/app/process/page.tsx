import type { Metadata } from "next";
import { getLocalBlur } from "@/lib/image-manifest";
import { ProcessExperience } from "@/components/process-reference/ProcessExperience";
import type { ProcessStep } from "@/components/process-reference/types";

export const metadata: Metadata = {
  title: "Process",
  description:
    "From conversation to delivery — how we work at Bahar Studio. Four phases, one standard: nothing leaves until it's worth keeping.",
};

const STEPS: ProcessStep[] = [
  {
    id: "01",
    title: "Conversation",
    description:
      "Every project starts with a conversation. We learn about you, the occasion, the setting, and the feeling you want to walk away with. From there, we plan.",
    meta: "Phase: Planning & Scope",
    images: [
      {
        src: "/images/process/01.jpg",
        alt: "Graduate browsing books in the library stacks",
        blurDataURL: getLocalBlur("/images/process/01.jpg"),
      },
    ],
    layout: "single",
    align: "left",
  },
  {
    id: "02",
    title: "Presence",
    description:
      "On the day, we work with intention — reading the light, directing when it helps, staying ready for the moments that can't be planned. Every frame is composed, not just taken.",
    metaList: ["Phase: The Shoot"],
    images: [
      {
        src: "/images/process/02.jpg",
        alt: "Live basketball photography during March Madness",
        blurDataURL: getLocalBlur("/images/process/02.jpg"),
      },
    ],
    layout: "bordered",
    align: "right",
  },
  {
    id: "03",
    title: "Selection",
    description:
      "From every session, we select only the strongest images — where composition, expression, and light come together. Quality over quantity, always.",
    meta: "Phase: Selection",
    images: [
      {
        src: "/images/process/03.jpg",
        alt: "Portrait in golden light — a curated moment",
        blurDataURL: getLocalBlur("/images/process/03.jpg"),
      },
    ],
    layout: "ultrawide",
    align: "left",
  },
  {
    id: "04",
    title: "Refinement",
    description:
      "Each selected image is graded by hand for tone, mood, and consistency. The final collection is delivered as a cohesive set — something worth coming back to.",
    images: [
      {
        src: "/images/process/04a.jpg",
        alt: "Graduate reaching for a book in cap and gown",
        blurDataURL: getLocalBlur("/images/process/04a.jpg"),
      },
      {
        src: "/images/process/04b.jpg",
        alt: "Dense forest hillside landscape",
        blurDataURL: getLocalBlur("/images/process/04b.jpg"),
      },
      {
        src: "/images/process/04c.jpg",
        alt: "Graduate sitting on stone steps",
        blurDataURL: getLocalBlur("/images/process/04c.jpg"),
      },
      {
        src: "/images/process/04d.jpg",
        alt: "Mountain panorama with clouds and mist",
        blurDataURL: getLocalBlur("/images/process/04d.jpg"),
      },
    ],
    layout: "grid",
    align: "right",
    action: { label: "View Work", href: "/work" },
  },
];

export default function ProcessPage() {
  return (
    <ProcessExperience
      heroImage={{
        src: "/images/exhibition-hero.jpg",
        alt: "Empty basketball arena — Bahar Studio",
        blurDataURL: getLocalBlur("/images/exhibition-hero.jpg"),
      }}
      steps={STEPS}
    />
  );
}
