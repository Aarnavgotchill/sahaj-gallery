import { defineType, defineField } from "sanity";

export default defineType({
  name: "service",
  title: "Service / Offering",
  type: "document",
  fields: [
    defineField({
      name: "number",
      title: "Number",
      type: "string",
      initialValue: "01",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: "Display Order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
});
