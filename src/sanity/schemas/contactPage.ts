import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "titleLine1",
      title: "Title Line 1",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleLine2",
      title: "Title Line 2",
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
  preview: {
    prepare() {
      return { title: "Contact Page" };
    },
  },
});
