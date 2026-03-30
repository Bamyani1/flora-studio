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
      validation: (rule) => rule.required(),
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
