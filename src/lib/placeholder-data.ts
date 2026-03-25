import type { Album, AlbumMeta } from "@/types/project";

function img(url: string) {
  return { _type: "image" as const, asset: { _ref: "", _type: "reference" as const }, url };
}

function albumImages(folder: string, count: number) {
  return Array.from({ length: count }, (_, i) =>
    img(`/images/${folder}/${String(i + 1).padStart(2, "0")}.jpg`),
  );
}

export const PLACEHOLDER_FEATURED_ALBUMS: AlbumMeta[] = [
  {
    _id: "album-1",
    title: "The Graduate",
    slug: { current: "the-graduate" },
    category: "milestones",
    description:
      "Cap, gown, and the quiet confidence of crossing a threshold. A portrait session marking the moment everything changes.",
    coverImage: img("/images/graduation/cover.jpg"),
  },
  {
    _id: "album-5",
    title: "Tip-Off",
    slug: { current: "tip-off" },
    category: "motion",
    description:
      "The ball is live. A courtside study of explosive movement, split-second timing, and the energy that fills an arena at tip-off.",
    coverImage: img("/images/high-country/cover.jpg"),
  },
  {
    _id: "album-3",
    title: "Courtside",
    slug: { current: "courtside" },
    category: "gatherings",
    description:
      "Floor-level framing and fast glass. An event series capturing the raw energy of game day — from warm-ups to the final buzzer.",
    coverImage: img("/images/lakeshore/cover.jpg"),
  },
  {
    _id: "album-9",
    title: "Portraits",
    slug: { current: "portraits" },
    category: "portraits",
    description:
      "Every face carries something worth photographing. Mixed-session portraits that find the extraordinary in stillness and the light between expressions.",
    coverImage: img("/images/out-west/cover.jpg"),
  },
];

export const PLACEHOLDER_ALL_ALBUMS: Album[] = [
  {
    _id: "album-1",
    title: "The Graduate",
    slug: { current: "the-graduate" },
    category: "milestones",
    year: 2025,
    location: "Ohio",
    order: 1,
    featured: true,
    coverImage: img("/images/graduation/cover.jpg"),
    heroImage: img("/images/graduation/hero.jpg"),
    description:
      "Cap, gown, and the quiet confidence of crossing a threshold. A portrait session marking the moment everything changes.",
    narrative:
      "The morning light cut through campus like a curtain rising on a final act. Four years of late nights and early mornings led to this — a cap set straight, a gown carrying the weight of everything earned. In the stillness between poses, confidence surfaced. Not loud, not rehearsed — just the quiet certainty of someone stepping into what comes next.",
    images: albumImages("graduation", 5),
  },
  {
    _id: "album-2",
    title: "Milestone",
    slug: { current: "milestone" },
    category: "milestones",
    year: 2025,
    location: "Ohio",
    order: 2,
    coverImage: img("/images/golden-hour/cover.jpg"),
    heroImage: img("/images/golden-hour/hero.jpg"),
    description:
      "Four years in the making. A graduation session built around natural light, personal style, and the weight of what's been earned.",
    narrative:
      "Some sessions you plan around the golden hour. This one planned itself — the graduate knew exactly where they wanted to stand, which steps meant the most, which view carried the memory. We followed the light and let the location do the talking. Every frame felt earned.",
    images: albumImages("golden-hour", 6),
  },
  {
    _id: "album-3",
    title: "Courtside",
    slug: { current: "courtside" },
    category: "gatherings",
    year: 2025,
    location: "Dayton, Ohio",
    order: 3,
    featured: true,
    coverImage: img("/images/lakeshore/cover.jpg"),
    heroImage: img("/images/lakeshore/hero.jpg"),
    description:
      "The energy of game day from the best seat in the house. Capturing the crowd, the players, and the moments between the whistles.",
    narrative:
      "From the floor, basketball sounds different. Sneakers grip, voices carry, and the crowd becomes a single pulse. Courtside is where the game reveals its texture — the focus in a player's eyes before a free throw, the eruption of a bench after a three, the stillness of a timeout huddle. Every frame is a front-row seat.",
    images: albumImages("lakeshore", 7),
  },
  {
    _id: "album-4",
    title: "School Spirit",
    slug: { current: "school-spirit" },
    category: "gatherings",
    year: 2025,
    location: "Dayton, Ohio",
    order: 4,
    coverImage: img("/images/wanderlust/cover.jpg"),
    heroImage: img("/images/wanderlust/hero.jpg"),
    description:
      "Pep rallies, halftime shows, and the buzz of a campus coming together. The events that make the school year unforgettable.",
    narrative:
      "The gymnasium fills with a sound that has no studio equivalent — raw, unfiltered energy bouncing off concrete walls and metal bleachers. Cheerleaders launch, mascots sprint, and for a few electric minutes, everyone in the building shares the same heartbeat. These are the frames that yearbooks remember.",
    images: albumImages("wanderlust", 11),
  },
  {
    _id: "album-5",
    title: "Tip-Off",
    slug: { current: "tip-off" },
    category: "motion",
    year: 2025,
    location: "Dayton, Ohio",
    order: 5,
    featured: true,
    coverImage: img("/images/high-country/cover.jpg"),
    heroImage: img("/images/high-country/hero.jpg"),
    description:
      "The intensity of live basketball — fast breaks, contested shots, and the energy that fills the arena from the opening whistle.",
    narrative:
      "The ball goes up and everything accelerates. Bodies pivot, sneakers squeak against hardwood, and the arena narrows to a single point of action. In live basketball, the decisive moment lasts a fraction of a second — a mid-air adjustment, a block at the rim, a pass threaded through traffic. We shoot at the speed of the game.",
    images: albumImages("high-country", 11),
  },
  {
    _id: "album-6",
    title: "Senior Night",
    slug: { current: "senior-night" },
    category: "motion",
    year: 2025,
    location: "Dayton, Ohio",
    order: 6,
    coverImage: img("/images/senior-night/cover.jpg"),
    heroImage: img("/images/senior-night/hero.jpg"),
    description:
      "A farewell to the players who gave everything. Family embraces, framed jerseys, and the emotion of a final home game.",
    narrative:
      "The arena is full but the spotlight narrows. Seniors walk to center court with their families — the people who drove them to practice, who cheered from the nosebleeds, who believed before anyone else did. Framed jerseys are held like trophies. Embraces linger. Tonight the scoreboard is secondary to the story.",
    images: albumImages("senior-night", 7),
  },
  {
    _id: "album-7",
    title: "March Madness",
    slug: { current: "march-madness" },
    category: "motion",
    year: 2025,
    location: "Dayton, Ohio",
    order: 7,
    coverImage: img("/images/march-madness/cover.jpg"),
    heroImage: img("/images/march-madness/hero.jpg"),
    description:
      "Tournament basketball at its peak. The press tables, the practice courts, and the tension that builds before every tip-off.",
    narrative:
      "The arena breathes differently during tournament play — every possession weighted, every timeout charged with strategy. The press tables hum, cameras line the baseline, and the air carries the kind of tension that only March delivers. We photograph the full arc: warm-ups, game faces, final buzzers, and the silence after the last whistle.",
    images: albumImages("march-madness", 16),
  },
  {
    _id: "album-8",
    title: "Practice",
    slug: { current: "practice" },
    category: "motion",
    year: 2025,
    location: "Dayton, Ohio",
    order: 8,
    coverImage: img("/images/after-dark/cover.jpg"),
    heroImage: img("/images/after-dark/hero.jpg"),
    description:
      "Before the lights come on. Early mornings, empty courts, and the quiet discipline that makes game day possible.",
    narrative:
      "No crowd, no scoreboard, no anthem. Just the echo of a ball against hardwood and the sound of work being done. Practice is where the real story lives — repetition building instinct, coaches shaping strategy, players pushing past the point where talent alone carries them. The empty gym holds more truth than any packed arena.",
    images: albumImages("after-dark", 6),
  },
  {
    _id: "album-9",
    title: "Portraits",
    slug: { current: "portraits" },
    category: "portraits",
    year: 2025,
    location: "Various",
    order: 9,
    featured: true,
    coverImage: img("/images/out-west/cover.jpg"),
    heroImage: img("/images/out-west/hero.jpg"),
    description:
      "Faces, light, and the quiet moments in between. A collection of personal sessions across styles and seasons.",
    narrative:
      "Every portrait session starts the same way — a conversation, a read on the light, and the patience to wait for the mask to drop. The best frames come when people stop performing and start being. Across seasons and settings, this collection is about the faces that trusted us with their stillness.",
    images: albumImages("out-west", 10),
  },
];

export const PLACEHOLDER_ALBUM_MAP: Record<string, Album> = Object.fromEntries(
  PLACEHOLDER_ALL_ALBUMS.map((album) => [album.slug.current, album]),
);

export const PLACEHOLDER_ABOUT = {
  bio: "A photography studio built on patience, precision, and the belief that the most valuable things are the ones that took real care to make.",
  portrait: {
    _type: "image" as const,
    asset: { _ref: "", _type: "reference" as const },
    url: "/images/portrait.jpg",
  },
  portraitBlur: null,
  approach:
    "We approach every shoot with a clear vision and an open eye. Whether it's the energy of a game, the emotion of graduation day, or a quiet portrait session, we work to find the light, the composition, and the moment that make an image last.",
  services: [
    {
      title: "Milestones",
      description: "Caps, gowns, and the moments that mark a new beginning.",
    },
    {
      title: "Gatherings",
      description: "The energy of people coming together — game days, campus nights, celebrations.",
    },
    {
      title: "Motion",
      description: "Fast breaks, final buzzers, and everything in between.",
    },
    {
      title: "Portraits",
      description: "Everyone has something worth photographing.",
    },
    {
      title: "Professional",
      description: "Clean, confident images for the work you do.",
    },
  ],
  socialLinks: [
    { platform: "Instagram", url: "#" },
    { platform: "Behance", url: "#" },
    { platform: "LinkedIn", url: "#" },
  ],
};
