import { localImageFromPublicPath } from "@/lib/placeholder-images";
import type {
  AboutPageContent,
  ContactPageContent,
  HomePageContent,
  ProcessPageContent,
  SiteSettings,
} from "@/types/content";

export const PLACEHOLDER_SITE_SETTINGS: SiteSettings = {
  _id: "siteSettings",
  studioName: "Bahar Studio",
  location: "Dayton, Ohio",
  email: "info@studiobahar.com",
  phone: "(937)-7977381",
  socialLinks: [
    {
      label: "Instagram",
      platform: "Instagram",
      url: "https://instagram.com/baharstudio",
      icon: "instagram",
    },
  ],
  sameAs: [
    "https://instagram.com/baharstudio",
  ],
};

export const PLACEHOLDER_HOME_PAGE: HomePageContent = {
  _id: "homePage",
  hero: {
    eyebrow: "Photography with intention",
    titleLine1: "Every frame,",
    titleLine2: "earned.",
    description: "Patience, craft, and an eye for what matters.",
    mediaCycle: [
      localImageFromPublicPath("/images/landing-hero.jpg", "Bahar Studio hero photograph"),
      localImageFromPublicPath("/images/studio-hero.jpg", "Bahar Studio featured work"),
      localImageFromPublicPath("/images/editorial-hero.jpg", "Bahar Studio editorial photograph"),
      localImageFromPublicPath("/images/exhibition-hero.jpg", "Bahar Studio exhibition photograph"),
    ],
  },
  editorial: {
    image: localImageFromPublicPath(
      "/images/studio-hero.jpg",
      "Bahar Studio featured work",
    ),
    titleLine1: "We pay attention",
    titleLine2Lead: "to",
    titleLine2Muted: "the",
    titleLine2Accent: "light.",
    description:
      "Our work starts long before the camera comes out — with a conversation, a plan, and a clear sense of what we're making together. Every image is selected by hand and graded individually. What you receive isn't a batch of photos. It's a collection that was tended to.",
    cta: {
      label: "See the work",
      href: "/work",
    },
  },
  exhibition: {
    eyebrow: "EXHIBITION 01",
    titleLine1: "Before",
    titleLine2: "the Game",
    description:
      "An empty arena holds every game it's ever seen. The silence before tip-off, the geometry of the court, and the weight of what's about to happen.",
    cta: {
      label: "Explore Exhibition",
      href: "/work",
    },
    image: localImageFromPublicPath("/images/editorial-hero.jpg", "Bahar Studio editorial photograph"),
  },
  studio: {
    image: localImageFromPublicPath("/images/game-day/hero.jpg", "Bahar Studio game day action photograph"),
    ctaEyebrow: "Work With Us",
    ctaLabel: "Get in Touch",
    cta: {
      label: "Get in Touch",
      href: "/contact",
    },
  },
};

export const PLACEHOLDER_ABOUT_PAGE: AboutPageContent = {
  _id: "aboutPage",
  hero: {
    eyebrow: "Bahar Studio",
    titleLine1: "Who We",
    titleLine2: "Are.",
    description:
      "A photography studio built on patience, precision, and the belief that everyone has something worth photographing.",
  },
  manifesto: {
    eyebrow: "Our Approach",
    quotePrefix: "We show up prepared, stay present, and make every",
    quoteAccent: "frame",
    quoteSuffix: "count. No shortcuts, no templates — just intention behind everything we do.",
    footerLabel: "Our Approach",
  },
  team: {
    eyebrow: "The People",
    title: "The Team",
    description:
      "Three photographers with a shared commitment to craft and a habit of paying close attention.",
    members: [
      {
        name: "Mostafa Bamyani",
        role: "Photographer & Designer",
        portrait: localImageFromPublicPath("/images/portrait.jpg", "Portrait of Mostafa Bamyani"),
      },
      {
        name: "Mortaza Anwari",
        role: "Photographer",
        portrait: localImageFromPublicPath("/images/portrait-mortaza.jpg", "Portrait of Mortaza Anwari"),
      },
      {
        name: "Enayatullah Anwari",
        role: "Photographer",
        portrait: localImageFromPublicPath("/images/portrait-enayat.jpg", "Portrait of Enayatullah Anwari"),
      },
    ],
  },
  process: {
    eyebrow: "How It Works",
    title: "How we work.",
    description:
      "We grade and refine every image by hand to get the tone, mood, and consistency right — not filtered, not batch-processed, not rushed.",
    cards: [
      {
        title: "Selection",
        description:
          "From hundreds of frames, we keep only the ones where light, expression, and composition come together.",
      },
      {
        title: "Refinement",
        description:
          "Each image is individually graded. We build a visual language specific to your vision.",
      },
    ],
    image: localImageFromPublicPath("/images/about-process.jpg", "Bahar Studio creative process"),
  },
  cta: {
    eyebrow: "What's next",
    titleLine1: "Let's make",
    titleLine2: "something.",
    cta: {
      label: "Get in touch",
      href: "/contact",
    },
  },
};

export const PLACEHOLDER_PROCESS_PAGE: ProcessPageContent = {
  _id: "processPage",
  hero: {
    titleLine1: "Our Process:",
    titleLine2: "Frame by Frame",
    image: localImageFromPublicPath("/images/process/hero.jpg", "Bahar Studio process hero"),
  },
  intro: {
    title: "The Process",
    description:
      "Every image begins long before the shutter opens. The method is a dialogue between light, timing, and atmosphere, shaped deliberately so the final frame feels inevitable.",
  },
  steps: [
    {
      id: "01",
      title: "Conversation",
      description:
        "Every session starts with a conversation. We learn about you, the occasion, the setting, and the feeling you want to walk away with. From there, we plan.",
      meta: "Phase: Planning & Scope",
      images: [
        localImageFromPublicPath("/images/process/01.jpg", "Planning and conversation phase"),
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
      images: [localImageFromPublicPath("/images/process/02.jpg", "On location during the shoot")],
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
        localImageFromPublicPath("/images/process/03.jpg", "Selecting the strongest frames"),
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
        localImageFromPublicPath("/images/process/04a.jpg", "Refinement — portrait tones"),
        localImageFromPublicPath("/images/process/04b.jpg", "Refinement — interior shadows"),
        localImageFromPublicPath("/images/process/04c.jpg", "Refinement — golden hour"),
        localImageFromPublicPath("/images/process/04d.jpg", "Refinement — natural color"),
      ],
      layout: "grid",
      align: "right",
      action: {
        label: "View Work",
        href: "/work",
      },
    },
  ],
  contactCta: {
    heading: "Get In Touch",
    buttonLabel: "Contact",
    buttonHref: "/contact",
  },
};

export const PLACEHOLDER_CONTACT_PAGE: ContactPageContent = {
  _id: "contactPage",
  titleLine1: "Get in",
  titleLine2: "touch.",
  description: "Have a vision in mind? We'd love to hear about it.",
};
