import type { AlbumMeta } from "@/types/project";

export const PLACEHOLDER_FEATURED_ALBUMS: AlbumMeta[] = [
  {
    _id: "placeholder-1",
    title: "Silent Peaks",
    slug: { current: "silent-peaks" },
    category: "personal",
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } },
  },
  {
    _id: "placeholder-2",
    title: "The Grand Stage",
    slug: { current: "the-grand-stage" },
    category: "event",
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } },
  },
  {
    _id: "placeholder-3",
    title: "Breaking Point",
    slug: { current: "breaking-point" },
    category: "sports",
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } },
  },
  {
    _id: "placeholder-4",
    title: "Inner Light",
    slug: { current: "inner-light" },
    category: "solo",
    coverImage: { _type: "image", asset: { _ref: "", _type: "reference" } },
  },
];

export const PLACEHOLDER_ABOUT = {
  bio: "A visual storyteller drawn to the quiet drama of light, shadow, and human presence. Every frame is a search for the cinematic in the everyday.",
  portrait: null,
  portraitBlur: null,
};
