import { defineArrayMember, defineField, defineType } from "sanity";

export const ctaLink = defineType({
  name: "ctaLink",
  title: "CTA Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Href",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
});

export const socialLink = defineType({
  name: "socialLink",
  title: "Social Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "Behance", value: "behance" },
          { title: "LinkedIn", value: "linkedin" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "url",
    },
  },
});

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
});

export const teamMember = defineType({
  name: "teamMember",
  title: "Team Member",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "imageWithAlt",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "portrait",
    },
  },
});

export const aboutProcessCard = defineType({
  name: "aboutProcessCard",
  title: "About Process Card",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
  ],
});

export const processStep = defineType({
  name: "processStep",
  title: "Process Step",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "Step ID",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "align",
      title: "Align",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Single", value: "single" },
          { title: "Bordered", value: "bordered" },
          { title: "Ultrawide", value: "ultrawide" },
          { title: "Grid", value: "grid" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "meta",
      title: "Meta",
      type: "string",
    }),
    defineField({
      name: "metaList",
      title: "Meta List",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "action",
      title: "Action",
      type: "ctaLink",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "id",
      media: "images.0",
    },
  },
});
