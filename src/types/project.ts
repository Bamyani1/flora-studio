export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
    url?: string;
  };
  alt?: string;
  caption?: string;
  blurDataURL?: string;
  url?: string;
}

export interface AlbumMeta {
  _id: string;
  title: string;
  slug: { current: string };
  category: "landscapes" | "nightsky" | "sports" | "portraits" | "stories";
  year?: number;
  location?: string;
  coverImage: SanityImage;
  blurDataURL?: string;
  order?: number;
}

export interface Album extends AlbumMeta {
  description?: string;
  heroImage: SanityImage;
  heroBlur?: string;
  images: (SanityImage & { blurDataURL?: string })[];
  narrative?: string;
  featured?: boolean;
}
