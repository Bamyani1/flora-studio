import { defineArrayMember, defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroTitleLine1",
      title: "Hero Title Line 1",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroTitleLine2",
      title: "Hero Title Line 2",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroMediaCycle",
      title: "Hero Media Cycle",
      type: "array",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "editorialImage",
      title: "Editorial Image",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "editorialTitleLine1",
      title: "Editorial Title Line 1",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "editorialTitleLine2Lead",
      title: "Editorial Title Line 2 Lead",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "editorialTitleLine2Muted",
      title: "Editorial Title Line 2 Muted",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "editorialTitleLine2Accent",
      title: "Editorial Title Line 2 Accent",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "editorialDescription",
      title: "Editorial Description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "editorialCta",
      title: "Editorial CTA",
      type: "ctaLink",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "exhibitionEyebrow",
      title: "Exhibition Eyebrow",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "exhibitionTitleLine1",
      title: "Exhibition Title Line 1",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "exhibitionTitleLine2",
      title: "Exhibition Title Line 2",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "exhibitionDescription",
      title: "Exhibition Description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "exhibitionImage",
      title: "Exhibition Image",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "exhibitionCta",
      title: "Exhibition CTA",
      type: "ctaLink",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "studioImage",
      title: "Studio Image",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "studioCtaEyebrow",
      title: "Studio CTA Eyebrow",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "studioCtaLabel",
      title: "Studio CTA Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "studioCta",
      title: "Studio CTA",
      type: "ctaLink",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
