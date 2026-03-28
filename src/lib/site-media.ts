import type { ProcessStep } from "@/components/process-reference/types";
import type { SanityImage } from "@/types/project";

export const PLACEHOLDER_MEDIA_SRC = "placeholder://bahar-studio/media";
export const PLACEHOLDER_MEDIA_VIDEO_TOKEN = "placeholder://bahar-studio/video";
export const PLACEHOLDER_MEDIA_LABEL = "Media Placeholder";

interface PlaceholderImageOptions {
  alt?: string;
  key?: string;
  width?: number;
  height?: number;
}

function buildPlaceholderRef(width = 2400, height = 1600, key = "placeholder") {
  return `image-${key}-${width}x${height}-jpg`;
}

export function createPlaceholderImage({
  alt = PLACEHOLDER_MEDIA_LABEL,
  key = "placeholder",
  width = 2400,
  height = 1600,
}: PlaceholderImageOptions = {}): SanityImage {
  return {
    _type: "image",
    asset: {
      _ref: buildPlaceholderRef(width, height, key),
      _type: "reference",
    },
    alt,
    url: `${PLACEHOLDER_MEDIA_SRC}/${key}`,
  };
}

export function createPlaceholderGallery(count: number, keyPrefix: string, altPrefix: string) {
  return Array.from({ length: count }, (_, index) =>
    createPlaceholderImage({
      alt: `${altPrefix} ${index + 1}`,
      key: `${keyPrefix}-${index + 1}`,
      width: 1600,
      height: index % 3 === 0 ? 2400 : index % 3 === 1 ? 1600 : 1067,
    }),
  );
}

export const LANDING_MEDIA = {
  hero: {
    src: "/images/landing-hero.jpg",
    alt: "Bahar Studio hero photograph",
    width: 2133,
    height: 3200,
  },
  editorial: {
    src: "/images/editorial-hero.jpg",
    alt: "Bahar Studio editorial photograph",
    width: 2133,
    height: 3200,
  },
  exhibition: {
    src: "/images/exhibition-hero.jpg",
    alt: "Bahar Studio exhibition photograph",
    width: 2133,
    height: 3200,
  },
  studio: {
    src: "/images/studio-hero.jpg",
    alt: "Bahar Studio featured work",
    width: 2041,
    height: 3200,
  },
} as const;

export const ABOUT_MEDIA = {
  process: {
    src: "/images/about-process.jpg",
    alt: "Bahar Studio creative process",
  },
} as const;

export const ABOUT_TEAM_MEMBERS = [
  {
    role: "Photographer & Designer",
    name: "Mostafa Bamyani",
    media: {
      src: "/images/portrait.jpg",
      alt: "Portrait of Mostafa Bamyani",
    },
  },
  {
    role: "Photographer",
    name: "Murtaza Anwari",
    media: {
      src: `${PLACEHOLDER_MEDIA_SRC}/team-murtaza-anwari`,
      alt: "Portrait placeholder for Murtaza Anwari",
    },
  },
  {
    role: "Photographer",
    name: "Enayatullah Anwari",
    media: {
      src: `${PLACEHOLDER_MEDIA_SRC}/team-enayatullah-anwari`,
      alt: "Portrait placeholder for Enayatullah Anwari",
    },
  },
] as const;

export const PROCESS_HERO_MEDIA = {
  src: "/images/process/hero.jpg",
  alt: "Bahar Studio process hero",
} as const;

export const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "01",
    title: "Conversation",
    description:
      "Every project starts with a conversation. We learn about you, the occasion, the setting, and the feeling you want to walk away with. From there, we plan.",
    meta: "Phase: Planning & Scope",
    images: [
      {
        src: "/images/process/01.jpg",
        alt: "Planning and conversation phase",
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
        alt: "On location during the shoot",
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
        alt: "Selecting the strongest frames",
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
        alt: "Refinement — portrait tones",
      },
      {
        src: "/images/process/04b.jpg",
        alt: "Refinement — interior shadows",
      },
      {
        src: "/images/process/04c.jpg",
        alt: "Refinement — golden hour",
      },
      {
        src: "/images/process/04d.jpg",
        alt: "Refinement — natural color",
      },
    ],
    layout: "grid",
    align: "right",
    action: { label: "View Work", href: "/work" },
  },
];
