import type { Album, AlbumMeta } from "@/types/project";
import { autoGallery, localImageFromPublicPath } from "@/lib/placeholder-images";

export const PLACEHOLDER_FEATURED_ALBUMS: AlbumMeta[] = [
  {
    _id: "album-1",
    title: "The Graduate",
    slug: { current: "the-graduate" },
    category: "milestones",
    description:
      "Cap, gown, and the quiet confidence of crossing a threshold. A portrait session marking the moment everything changes.",
    coverImage: localImageFromPublicPath("/images/the-graduate/cover.jpg", "The Graduate cover"),
  },
  {
    _id: "album-4",
    title: "March Madness",
    slug: { current: "march-madness" },
    category: "motion",
    description:
      "Tournament basketball at its peak. The press tables, the practice courts, and the tension that builds before every tip-off.",
    coverImage: localImageFromPublicPath("/images/march-madness/cover.jpg", "March Madness cover"),
  },
  {
    _id: "album-6",
    title: "Under the Lights",
    slug: { current: "under-the-lights" },
    category: "motion",
    description:
      "Friday night energy on the college gridiron. Helmets clash, plays unfold, and the crowd carries the team through every quarter.",
    coverImage: localImageFromPublicPath("/images/under-the-lights/cover.jpg", "Under the Lights cover"),
  },
  {
    _id: "album-9",
    title: "Nature Vol. I",
    slug: { current: "nature-vol-i" },
    category: "landscape",
    description:
      "Mountains, mist, and the silence between peaks. The first volume of an ongoing landscape series across the American West.",
    coverImage: localImageFromPublicPath("/images/nature-vol-i/cover.jpg", "Nature Vol. I cover"),
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
    coverImage: localImageFromPublicPath("/images/the-graduate/cover.jpg", "The Graduate cover"),
    heroImage: localImageFromPublicPath("/images/the-graduate/hero.jpg", "The Graduate hero"),
    description:
      "Cap, gown, and the quiet confidence of crossing a threshold. A portrait session marking the moment everything changes.",
    narrative:
      "The morning light cut through campus like a curtain rising on a final act. Four years of late nights and early mornings led to this. A cap set straight, a gown carrying the weight of everything earned. In the stillness between poses, confidence surfaced. Not loud, not rehearsed. Just the quiet certainty of someone stepping into what comes next.",
    images: autoGallery("the-graduate", "The Graduate"),
  },
  {
    _id: "album-2",
    title: "Milestone",
    slug: { current: "milestone" },
    category: "milestones",
    year: 2025,
    location: "Ohio",
    order: 2,
    coverImage: localImageFromPublicPath("/images/milestone/cover.jpg", "Milestone cover"),
    heroImage: localImageFromPublicPath("/images/milestone/hero.jpg", "Milestone hero"),
    description:
      "Four years in the making. A graduation session built around natural light, personal style, and the weight of what's been earned.",
    narrative:
      "Some sessions you plan around the golden hour. This one planned itself. The graduate knew exactly where they wanted to stand, which steps meant the most, which view carried the memory. We followed the light and let the location do the talking. Every frame felt earned.",
    images: autoGallery("milestone", "Milestone"),
    videoUrl: "/videos/milestone.mp4",
  },
  {
    _id: "album-3",
    title: "Game Day",
    slug: { current: "game-day" },
    category: "motion",
    year: 2025,
    location: "Dayton, Ohio",
    order: 3,
    coverImage: localImageFromPublicPath("/images/game-day/cover.jpg", "Game Day cover"),
    heroImage: localImageFromPublicPath("/images/game-day/hero.jpg", "Game Day hero"),
    description:
      "The energy of game day from the best seat in the house. Capturing the crowd, the players, and the moments between the whistles.",
    narrative:
      "From the floor, basketball sounds different. Sneakers grip, voices carry, and the crowd becomes a single pulse. Courtside is where the game reveals its texture. The focus in a player's eyes before a free throw, the eruption of a bench after a three, the stillness of a timeout huddle. Every frame is a front-row seat.",
    images: autoGallery("game-day", "Game Day"),
  },
  {
    _id: "album-4",
    title: "March Madness",
    slug: { current: "march-madness" },
    category: "motion",
    year: 2025,
    location: "Dayton, Ohio",
    order: 4,
    featured: true,
    coverImage: localImageFromPublicPath("/images/march-madness/cover.jpg", "March Madness cover"),
    heroImage: localImageFromPublicPath("/images/march-madness/hero.jpg", "March Madness hero"),
    description:
      "Tournament basketball at its peak. The press tables, the practice courts, and the tension that builds before every tip-off.",
    narrative:
      "The arena breathes differently during tournament play. Every possession weighted, every timeout charged with strategy. The press tables hum, cameras line the baseline, and the air carries the kind of tension that only March delivers. We photograph the full arc: warm-ups, game faces, final buzzers, and the silence after the last whistle.",
    images: autoGallery("march-madness", "March Madness"),
  },
  {
    _id: "album-5",
    title: "Miami vs SMU",
    slug: { current: "miami-vs-smu" },
    category: "motion",
    year: 2025,
    location: "Dayton, Ohio",
    order: 5,
    coverImage: localImageFromPublicPath("/images/miami-vs-smu/cover.jpg", "Miami vs SMU cover"),
    heroImage: localImageFromPublicPath("/images/miami-vs-smu/hero.jpg", "Miami vs SMU hero"),
    description:
      "Conference play under the lights. A rivalry game captured from the sideline. Fast breaks, contested shots, and the roar of a packed arena.",
    narrative:
      "Two programs, one floor, and a crowd that won't sit down. Conference games carry a weight that preseason can't match. Every call amplified, every run met with a counter. We stayed low, shot fast, and let the game unfold. The best frames came in the spaces between plays. The glance at the clock, the huddle break, the walk back to the bench.",
    images: autoGallery("miami-vs-smu", "Miami vs SMU"),
  },
  {
    _id: "album-6",
    title: "Under the Lights",
    slug: { current: "under-the-lights" },
    category: "motion",
    year: 2025,
    location: "Dayton, Ohio",
    order: 6,
    featured: true,
    coverImage: localImageFromPublicPath("/images/under-the-lights/cover.jpg", "Under the Lights cover"),
    heroImage: localImageFromPublicPath("/images/under-the-lights/hero.jpg", "Under the Lights hero"),
    description:
      "Friday night energy on the college gridiron. Helmets clash, plays unfold, and the crowd carries the team through every quarter.",
    narrative:
      "Under stadium lights, football becomes something elemental. The crack of pads, the arc of a spiral, the collective exhale after a third-down conversion. The sideline is where the story lives: coaches mapping the next series, players locked in, and the late-afternoon sky giving way to floodlights. We shoot from the trenches and let the energy speak.",
    images: autoGallery("under-the-lights", "Under the Lights"),
  },
  {
    _id: "album-7",
    title: "UD Basketball",
    slug: { current: "ud-basketball" },
    category: "motion",
    year: 2025,
    location: "Dayton, Ohio",
    order: 7,
    coverImage: localImageFromPublicPath("/images/ud-basketball/cover.jpg", "UD Basketball cover"),
    heroImage: localImageFromPublicPath("/images/ud-basketball/hero.jpg", "UD Basketball hero"),
    description:
      "Dayton Flyers basketball from the student section. The chants, the energy, and the community that fills UD Arena.",
    narrative:
      "UD Arena has a heartbeat. You feel it in the floorboards before tip-off, in the synchronized chants that start in the student section and roll through the upper deck. This isn't just basketball. It's a city showing up. We photograph the game, but the real story is the crowd: painted faces, bucket hats, and the belief that this team is theirs.",
    images: autoGallery("ud-basketball", "UD Basketball"),
  },
  {
    _id: "album-8",
    title: "Texas Cheer",
    slug: { current: "texas-cheer" },
    category: "gatherings",
    year: 2025,
    location: "Texas",
    order: 8,
    coverImage: localImageFromPublicPath("/images/texas-cheer/cover.jpg", "Texas Cheer cover"),
    heroImage: localImageFromPublicPath("/images/texas-cheer/hero.jpg", "Texas Cheer hero"),
    description:
      "Sideline energy and school spirit. Cheerleaders, pep squads, and the moments that make game day unforgettable.",
    narrative:
      "The gymnasium fills with a sound that has no studio equivalent. Raw, unfiltered energy bouncing off concrete walls and metal bleachers. Cheerleaders launch, the crowd responds, and for a few electric minutes, everyone in the building shares the same heartbeat. These are the frames that yearbooks remember.",
    images: autoGallery("texas-cheer", "Texas Cheer"),
  },
  {
    _id: "album-9",
    title: "Nature Vol. I",
    slug: { current: "nature-vol-i" },
    category: "landscape",
    year: 2025,
    location: "United States",
    order: 9,
    featured: true,
    coverImage: localImageFromPublicPath("/images/nature-vol-i/cover.jpg", "Nature Vol. I cover"),
    heroImage: localImageFromPublicPath("/images/nature-vol-i/hero.jpg", "Nature Vol. I hero"),
    description:
      "Mountains, mist, and the silence between peaks. The first volume of an ongoing landscape series across the American West.",
    narrative:
      "There's a stillness in high country that a lens can only approximate. Fog threads through valleys, light breaks over ridgelines without warning, and the scale of things makes every composition feel humbling. Volume I covers the first leg. National parks, backcountry trails, and the landscapes that remind you why you carry the weight.",
    images: autoGallery("nature-vol-i", "Nature Vol. I"),
  },
  {
    _id: "album-10",
    title: "Nature Vol. II",
    slug: { current: "nature-vol-ii" },
    category: "landscape",
    year: 2025,
    location: "United States",
    order: 10,
    coverImage: localImageFromPublicPath("/images/nature-vol-ii/cover.jpg", "Nature Vol. II cover"),
    heroImage: localImageFromPublicPath("/images/nature-vol-ii/hero.jpg", "Nature Vol. II hero"),
    description:
      "Forests, waterways, and the quiet drama of the American interior. The second volume pushes deeper into unfamiliar terrain.",
    narrative:
      "Volume II traded mountain passes for river corridors and dense forest. The light changed. Filtered, diffused, unpredictable. We waited longer for each frame, let the conditions set the pace, and learned that the best landscape images come from patience, not peak-bagging. Every exposure is a conversation with the weather.",
    images: autoGallery("nature-vol-ii", "Nature Vol. II"),
  },
  {
    _id: "album-11",
    title: "Nature Vol. III",
    slug: { current: "nature-vol-iii" },
    category: "landscape",
    year: 2025,
    location: "United States",
    order: 11,
    coverImage: localImageFromPublicPath("/images/nature-vol-iii/cover.jpg", "Nature Vol. III cover"),
    heroImage: localImageFromPublicPath("/images/nature-vol-iii/hero.jpg", "Nature Vol. III hero"),
    description:
      "Canyons, open sky, and the vast geometry of the Southwest. The third volume completes the first arc of the landscape series.",
    narrative:
      "By the third volume, the eye sharpens. You stop chasing golden hour and start reading the sky for what it's actually doing. The Southwest delivered scale. Canyon walls that dwarf everything, mesa light that changes by the minute, and a silence so complete it becomes the subject. This is where the series found its voice.",
    images: autoGallery("nature-vol-iii", "Nature Vol. III"),
  },
];

export const PLACEHOLDER_ALBUM_MAP: Record<string, Album> = Object.fromEntries(
  PLACEHOLDER_ALL_ALBUMS.map((album) => [album.slug.current, album]),
);
