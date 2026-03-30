import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
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
      name: "manifestoEyebrow",
      title: "Manifesto Eyebrow",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "manifestoQuotePrefix",
      title: "Manifesto Quote Prefix",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "manifestoQuoteAccent",
      title: "Manifesto Quote Accent",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "manifestoQuoteSuffix",
      title: "Manifesto Quote Suffix",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "manifestoFooterLabel",
      title: "Manifesto Footer Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "teamEyebrow",
      title: "Team Eyebrow",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "teamTitle",
      title: "Team Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "teamDescription",
      title: "Team Description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "teamMembers",
      title: "Team Members",
      type: "array",
      of: [defineArrayMember({ type: "teamMember" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "processEyebrow",
      title: "Process Eyebrow",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "processTitle",
      title: "Process Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "processDescription",
      title: "Process Description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "processCards",
      title: "Process Cards",
      type: "array",
      of: [defineArrayMember({ type: "aboutProcessCard" })],
      validation: (rule) => rule.required().length(2),
    }),
    defineField({
      name: "processImage",
      title: "Process Image",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ctaEyebrow",
      title: "CTA Eyebrow",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ctaTitleLine1",
      title: "CTA Title Line 1",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ctaTitleLine2",
      title: "CTA Title Line 2",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "ctaLink",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
