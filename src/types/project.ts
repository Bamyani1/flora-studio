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
}

export interface Album extends AlbumMeta {
  heroImage: SanityImage;
  images: SanityImage[];
  narrative?: string;
  featured?: boolean;
  videoUrl?: string;
}
