export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
    url?: string;
  };
  alt?: string;
  caption?: string;
  url?: string;
  /** CSS object-position set in Studio, e.g. "50% 30%" */
  objectPosition?: string;
  mobileObjectPosition?: string;
  /** Studio focal point, 0–1 from the top-left */
  hotspot?: { x: number; y: number; width?: number; height?: number };
}

export interface AlbumMeta {
  _id: string;
  title: string;
  slug: { current: string };
  category: "milestones" | "gatherings" | "motion" | "portraits" | "professional" | "landscape";
  description?: string;
  year?: number;
  location?: string;
  coverImage: SanityImage;
  order?: number;
  imageCount?: number;
}

export interface Album extends AlbumMeta {
  heroImage: SanityImage;
  images: SanityImage[];
  narrative?: string;
  featured?: boolean;
  videoUrl?: string;
  videoPosterUrl?: string;
}
