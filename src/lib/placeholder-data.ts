import type { Album, AlbumMeta } from "@/types/project";

function img(url: string) {
  return { _type: "image" as const, asset: { _ref: "", _type: "reference" as const }, url };
}

function albumImages(slug: string, count: number) {
  return Array.from({ length: count }, (_, i) =>
    img(`/images/${slug}/${String(i + 1).padStart(2, "0")}.jpg`),
  );
}

export const PLACEHOLDER_FEATURED_ALBUMS: AlbumMeta[] = [
  {
    _id: "album-1",
    title: "High Country",
    slug: { current: "high-country" },
    category: "landscapes",
    coverImage: img("/images/high-country/cover.jpg"),
  },
  {
    _id: "album-2",
    title: "After Dark",
    slug: { current: "after-dark" },
    category: "nightsky",
    coverImage: img("/images/after-dark/cover.jpg"),
  },
  {
    _id: "album-3",
    title: "March Madness",
    slug: { current: "march-madness" },
    category: "sports",
    coverImage: img("/images/march-madness/cover.jpg"),
  },
  {
    _id: "album-4",
    title: "Golden Hour",
    slug: { current: "golden-hour" },
    category: "portraits",
    coverImage: img("/images/golden-hour/cover.jpg"),
  },
];

export const PLACEHOLDER_ALL_ALBUMS: Album[] = [
  {
    _id: "album-1",
    title: "High Country",
    slug: { current: "high-country" },
    category: "landscapes",
    year: 2024,
    location: "Colorado & Smokies",
    order: 1,
    featured: true,
    coverImage: img("/images/high-country/cover.jpg"),
    heroImage: img("/images/high-country/hero.jpg"),
    description: "From the Rockies to the Smokies — alpine drama where mist, light, and granite converge.",
    narrative:
      "Dawn broke over the ridgeline in shades of copper and ash. Each step carried the weight of centuries, the silence so vast it became a presence of its own. The peaks held their breath as light carved new stories into stone — mist threading through valleys like memory itself.",
    images: albumImages("high-country", 11),
  },
  {
    _id: "album-2",
    title: "After Dark",
    slug: { current: "after-dark" },
    category: "nightsky",
    year: 2024,
    location: "Various",
    order: 2,
    featured: true,
    coverImage: img("/images/after-dark/cover.jpg"),
    heroImage: img("/images/after-dark/hero.jpg"),
    description: "Long exposures under infinite skies. The Milky Way, the aurora, and the silence between stars.",
    narrative:
      "When the last light drains from the horizon, a different world awakens. The Milky Way emerges like a river of ancient light, the aurora dances in curtains of impossible color, and in the stillness between stars, you remember how small you are — and how beautiful that smallness feels.",
    images: albumImages("after-dark", 6),
  },
  {
    _id: "album-3",
    title: "March Madness",
    slug: { current: "march-madness" },
    category: "sports",
    year: 2025,
    location: "Dayton, Ohio",
    order: 3,
    featured: true,
    coverImage: img("/images/march-madness/cover.jpg"),
    heroImage: img("/images/march-madness/hero.jpg"),
    description: "Behind the scenes at the NCAA First Four — practice courts, press tables, and the tension before tip-off.",
    narrative:
      "The arena breathes differently when empty — all that polished hardwood reflecting overhead lights, March Madness banners hanging like promises. Then the teams arrive. Sneakers squeak, coaches whisper strategy, journalists ready their questions. The game hasn't started, but the story is already unfolding.",
    images: albumImages("march-madness", 16),
  },
  {
    _id: "album-4",
    title: "Golden Hour",
    slug: { current: "golden-hour" },
    category: "portraits",
    year: 2024,
    location: "Various",
    order: 4,
    featured: true,
    coverImage: img("/images/golden-hour/cover.jpg"),
    heroImage: img("/images/golden-hour/hero.jpg"),
    description: "Portraits caught in the last warm light — where landscape becomes backdrop and stillness tells the story.",
    narrative:
      "There is a window of light that lasts twenty minutes. The sun drops low enough to turn everything golden — skin glows, shadows stretch long, and the world becomes a studio. In that brief alchemy, faces reveal what words cannot. The landscape becomes a collaborator, framing each subject in warmth.",
    images: albumImages("golden-hour", 6),
  },
  {
    _id: "album-5",
    title: "Out West",
    slug: { current: "out-west" },
    category: "landscapes",
    year: 2024,
    location: "California",
    order: 5,
    coverImage: img("/images/out-west/cover.jpg"),
    heroImage: img("/images/out-west/hero.jpg"),
    description: "Yosemite granite, Joshua Tree sunsets, Death Valley storms. The American West at its most dramatic.",
    narrative:
      "The West is a cathedral built by time — granite walls that took millennia to carve, desert floors that bake under a sun older than memory. Joshua trees stand like ancient sentinels, storm clouds roll across Death Valley with theatrical precision, and Yosemite's waterfalls roar their ancient song into fog-filled valleys.",
    images: albumImages("out-west", 10),
  },
  {
    _id: "album-6",
    title: "Senior Night",
    slug: { current: "senior-night" },
    category: "sports",
    year: 2025,
    location: "Dayton, Ohio",
    order: 6,
    coverImage: img("/images/senior-night/cover.jpg"),
    heroImage: img("/images/senior-night/hero.jpg"),
    description: "A Dayton Flyers farewell — family, teammates, and the moment jerseys become memories.",
    narrative:
      "The arena is full but the spotlight narrows to four. Seniors walk to center court with their families — the people who drove them to practice, who cheered from the nosebleeds, who believed before anyone else did. Framed jerseys are held like trophies. Embraces linger. Tonight the scoreboard is secondary to the story.",
    images: albumImages("senior-night", 7),
  },
  {
    _id: "album-7",
    title: "Wanderlust",
    slug: { current: "wanderlust" },
    category: "stories",
    year: 2024,
    location: "Various",
    order: 7,
    coverImage: img("/images/wanderlust/cover.jpg"),
    heroImage: img("/images/wanderlust/hero.jpg"),
    description: "Reservoirs at sunset, Gothic cathedrals, city streets at midnight. The story between the destinations.",
    narrative:
      "The road unspooled like thread from a spool with no end. Turquoise reservoirs mirrored skies so vast they swallowed the horizon whole. Gothic cathedrals held centuries of silence in their vaulted ceilings. City streets at midnight painted the pavement in neon. Each frame was a love letter to the impermanence of perfect light.",
    images: albumImages("wanderlust", 11),
  },
  {
    _id: "album-8",
    title: "Lakeshore",
    slug: { current: "lakeshore" },
    category: "landscapes",
    year: 2024,
    location: "Michigan",
    order: 8,
    coverImage: img("/images/lakeshore/cover.jpg"),
    heroImage: img("/images/lakeshore/hero.jpg"),
    description: "Pictured Rocks in peak autumn — sandstone, turquoise water, and cascading forest gold.",
    narrative:
      "Lake Superior is cold enough to preserve anything — including the memory of autumn at its peak. Sandstone cliffs wear their mineral stains like war paint, turquoise water glows impossibly against rust-colored foliage, and waterfalls thread through ancient forest like silver ribbons unspooling in slow motion.",
    images: albumImages("lakeshore", 7),
  },
  {
    _id: "album-9",
    title: "Graduation",
    slug: { current: "graduation" },
    category: "portraits",
    year: 2024,
    location: "Campus",
    order: 9,
    coverImage: img("/images/graduation/cover.jpg"),
    heroImage: img("/images/graduation/hero.jpg"),
    description: "Cap, gown, and the quiet confidence of a milestone. A portrait session in warm library light.",
    narrative:
      "Between the bookshelves where four years of study left their mark, a graduate pauses. Cap straight, gown draped with earned weight, smile carrying the quiet confidence of someone who has crossed a threshold they cannot uncross. The library light, warm and golden, frames each moment like a page worth remembering.",
    images: albumImages("graduation", 5),
  },
];

export const PLACEHOLDER_ALBUM_MAP: Record<string, Album> = Object.fromEntries(
  PLACEHOLDER_ALL_ALBUMS.map((album) => [album.slug.current, album]),
);

export const PLACEHOLDER_ABOUT = {
  bio: "A visual storyteller drawn to the quiet drama of light, shadow, and human presence. Every frame is a search for the cinematic in the everyday.",
  portrait: { _type: "image" as const, asset: { _ref: "", _type: "reference" as const }, url: "/images/portrait.jpg" },
  portraitBlur: null,
  approach:
    "I believe photography is an act of witnessing. My work lives in the space between stillness and motion — finding the extraordinary tension in ordinary moments. Light is not just illumination; it is language, and every shadow tells the other half of the story.",
  services: [
    {
      title: "Landscapes",
      description:
        "From granite cathedrals to fog-wrapped coastlines — the earth's quiet drama, framed in light.",
    },
    {
      title: "Night Sky",
      description:
        "When the sun drops below the horizon, a different kind of light takes over.",
    },
    {
      title: "Sports",
      description:
        "The emotion of competition — from the tunnel to the press table, the moments between the moments.",
    },
    {
      title: "Portraits",
      description:
        "Every face carries a story. Portraits that find the extraordinary in stillness.",
    },
    {
      title: "Stories",
      description:
        "The in-between places. Cities at midnight, cathedrals in shadow, roads with no destination.",
    },
  ],
  socialLinks: [
    { platform: "Instagram", url: "https://instagram.com/silkstudio" },
    { platform: "Behance", url: "https://behance.net/silkstudio" },
    { platform: "LinkedIn", url: "https://linkedin.com/company/silkstudio" },
  ],
};
