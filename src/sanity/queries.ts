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
    _id, title, slug, category, year, location, description,
    coverImage, heroImage, images[], narrative, featured, order, videoUrl
  }`,
);

export const ALBUM_SLUGS_QUERY = defineQuery(`*[_type == "album"] { "slug": slug.current }`);

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings" && _id == "siteSettings"][0]{
    _id, studioName, location, email, phone, sameAs,
    socialLinks[]{
      label, platform, url, icon
    }
  }`,
);

export const HOME_PAGE_QUERY = defineQuery(
  `*[_type == "homePage" && _id == "homePage"][0]{
    _id,
    heroEyebrow,
    heroTitleLine1,
    heroTitleLine2,
    heroDescription,
    heroMediaCycle[],
    editorialImage,
    editorialTitleLine1,
    editorialTitleLine2Lead,
    editorialTitleLine2Muted,
    editorialTitleLine2Accent,
    editorialDescription,
    editorialCta,
    exhibitionEyebrow,
    exhibitionTitleLine1,
    exhibitionTitleLine2,
    exhibitionDescription,
    exhibitionImage,
    exhibitionCta,
    studioImage,
    studioCtaEyebrow,
    studioCtaLabel,
    studioCta
  }`,
);

export const ABOUT_PAGE_QUERY = defineQuery(
  `*[_type == "aboutPage" && _id == "aboutPage"][0]{
    _id,
    heroEyebrow,
    heroTitleLine1,
    heroTitleLine2,
    heroDescription,
    manifestoEyebrow,
    manifestoQuotePrefix,
    manifestoQuoteAccent,
    manifestoQuoteSuffix,
    manifestoFooterLabel,
    teamEyebrow,
    teamTitle,
    teamDescription,
    teamMembers[]{
      name,
      role,
      portrait
    },
    processEyebrow,
    processTitle,
    processDescription,
    processCards[]{
      title,
      description
    },
    processImage,
    ctaEyebrow,
    ctaTitleLine1,
    ctaTitleLine2,
    cta
  }`,
);

export const PROCESS_PAGE_QUERY = defineQuery(
  `*[_type == "processPage" && _id == "processPage"][0]{
    _id,
    heroTitleLine1,
    heroTitleLine2,
    heroImage,
    introTitle,
    introDescription,
    steps[]{
      id,
      title,
      description,
      align,
      layout,
      meta,
      metaList,
      images[],
      action
    },
    contactHeading,
    contactButtonLabel,
    contactButtonHref
  }`,
);

export const CONTACT_PAGE_QUERY = defineQuery(
  `*[_type == "contactPage" && _id == "contactPage"][0]{
    _id,
    titleLine1,
    titleLine2,
    description
  }`,
);
