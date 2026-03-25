import type { Metadata } from "next";
import { getLocalBlur } from "@/lib/image-manifest";
import { ProcessExperience } from "@/components/process-reference/ProcessExperience";
import type { ProcessStep } from "@/components/process-reference/types";

export const metadata: Metadata = {
  title: "Process",
  description:
    "From conversation to delivery — how we work at Saffron Studios. Four phases, one standard: nothing leaves until it's worth keeping.",
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
        src: "/images/graduation/01.jpg",
        alt: "Planning and ideation phase for a photography session",
        blurDataURL: getLocalBlur("/images/graduation/01.jpg"),
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
        src: "/images/march-madness/01.jpg",
        alt: "Live basketball photography during a game",
        blurDataURL: getLocalBlur("/images/march-madness/01.jpg"),
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
    meta: "Phase: Curation",
    images: [
      {
        src: "/images/out-west/01.jpg",
        alt: "Curated portrait from a personal session",
        blurDataURL: getLocalBlur("/images/out-west/01.jpg"),
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
        src: "/images/golden-hour/01.jpg",
        alt: "Final graded graduation portrait",
        blurDataURL: getLocalBlur("/images/golden-hour/01.jpg"),
      },
      {
        src: "/images/golden-hour/02.jpg",
        alt: "Final delivered portrait photograph",
        blurDataURL: getLocalBlur("/images/golden-hour/02.jpg"),
      },
      {
        src: "/images/graduation/01.jpg",
        alt: "Delivered graduation photograph",
        blurDataURL: getLocalBlur("/images/graduation/01.jpg"),
      },
      {
        src: "/images/graduation/02.jpg",
        alt: "Final portrait from graduation session",
        blurDataURL: getLocalBlur("/images/graduation/02.jpg"),
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
        src: "/images/high-country/hero.jpg",
        alt: "Photography hero image for Saffron Studios",
        blurDataURL: getLocalBlur("/images/high-country/hero.jpg"),
      }}
      steps={STEPS}
    />
  );
}
