import { defineType, defineField } from "sanity";

export const album = defineType({
  name: "album",
  title: "Album",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) =>
        rule.required().custom((value?: { current?: string }) => {
          const current = value?.current;
          if (!current) return "Required";
          // URL- and XML-safe slugs only; keeps arbitrary characters out of the
          // sitemap <loc> and route paths at the source.
          return (
            /^[a-z0-9-]+$/.test(current) ||
            "Slug may only contain lowercase letters, numbers, and hyphens"
          );
        }),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Milestones", value: "milestones" },
          { title: "Gatherings", value: "gatherings" },
          { title: "Motion", value: "motion" },
          { title: "Portraits", value: "portraits" },
          { title: "Professional", value: "professional" },
          { title: "Landscape", value: "landscape" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "narrative",
      title: "Narrative",
      type: "text",
      description: "Long-form narrative text for scroll-driven word reveal",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "imageWithAlt",
    }),
    defineField({
      name: "images",
      title: "Gallery Images",
      type: "array",
      of: [{ type: "imageWithAlt" }],
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "string",
      description: "Path to a video file (e.g. /videos/milestone.mp4)",
    }),
    defineField({
      name: "videoPosterUrl",
      title: "Video poster URL",
      type: "string",
      description:
        "Still shown before the film plays (e.g. /videos/milestone-poster.jpg) — ideally its first frame",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", media: "coverImage", category: "category" },
    prepare({ title, media, category }) {
      return { title, subtitle: category, media };
    },
  },
});
