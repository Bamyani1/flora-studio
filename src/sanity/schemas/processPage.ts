import { defineArrayMember, defineField, defineType } from "sanity";

export const processPage = defineType({
  name: "processPage",
  title: "Process Page",
  type: "document",
  fields: [
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
      name: "heroImage",
      title: "Hero Image",
      type: "imageWithAlt",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introTitle",
      title: "Intro Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introDescription",
      title: "Intro Description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [defineArrayMember({ type: "processStep" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "contactHeading",
      title: "Contact Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contactButtonLabel",
      title: "Contact Button Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contactButtonHref",
      title: "Contact Button Href",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return { title: "Process Page" };
    },
  },
});
