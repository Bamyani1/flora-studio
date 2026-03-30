import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "studioName",
      title: "Studio Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [defineArrayMember({ type: "socialLink" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "sameAs",
      title: "Metadata sameAs URLs",
      type: "array",
      of: [defineArrayMember({ type: "url" })],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
