import { defineQuery } from "next-sanity";

export const ALBUMS_QUERY = defineQuery(
  `*[_type == "album"] | order(order asc) {
    _id, title, slug, category, year, location, coverImage,
    "blurDataURL": coverImage.asset->metadata.lqip
  }`,
);

export const FEATURED_ALBUMS_QUERY = defineQuery(
  `*[_type == "album" && featured == true] | order(order asc)[0...4] {
    _id, title, slug, category, description, coverImage,
    "blurDataURL": coverImage.asset->metadata.lqip
  }`,
);

export const ALBUM_BY_SLUG_QUERY = defineQuery(
  `*[_type == "album" && slug.current == $slug][0] {
    title, slug, category, year, location, description,
    heroImage, "heroBlur": heroImage.asset->metadata.lqip,
    images[] { asset->, alt, caption, "blurDataURL": asset->metadata.lqip },
    narrative
  }`,
);

export const ALBUM_SLUGS_QUERY = defineQuery(`*[_type == "album"] { "slug": slug.current }`);

export const ABOUT_QUERY = defineQuery(
  `*[_type == "about"][0] {
    bio, portrait, "portraitBlur": portrait.asset->metadata.lqip,
    approach, services[], socialLinks[]
  }`,
);
