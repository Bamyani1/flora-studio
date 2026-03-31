import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemas";
import { studioStructure } from "./src/sanity/structure";

const SINGLETON_TYPES = new Set([
  "siteSettings",
  "homePage",
  "aboutPage",
  "processPage",
  "contactPage",
]);

export default defineConfig({
  name: "bahar-studio",
  title: "Bahar Studio",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [structureTool({ structure: studioStructure })],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => !SINGLETON_TYPES.has(template.schemaType ?? "")),
  },
});
