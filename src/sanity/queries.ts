import { defineQuery } from "next-sanity";

export const ALBUMS_QUERY = defineQuery(
  `*[_type == "album"] | order(order asc) {
    _id, title, slug, category, year, location, coverImage
  }`,
);

export const FEATURED_ALBUMS_QUERY = defineQuery(
  `*[_type == "album" && featured == true] | order(order asc)[0...4] {
    _id, title, slug, category, description, coverImage
  }`,
);

export const ALBUM_BY_SLUG_QUERY = defineQuery(
  `*[_type == "album" && slug.current == $slug][0] {
    title, slug, category, year, location, description,
    heroImage,
    images[] { asset->, alt, caption },
    narrative, videoUrl
  }`,
);

export const ALBUM_SLUGS_QUERY = defineQuery(`*[_type == "album"] { "slug": slug.current }`);
