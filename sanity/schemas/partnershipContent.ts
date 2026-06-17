import { defineType, defineField } from "sanity";

export default defineType({
  name: "partnershipContent",
  title: "Partnership / SAHAJ Page Content",
  type: "document",
  fields: [
    defineField({
      name: "section",
      title: "Section",
      type: "string",
      options: {
        list: [
          { title: "Hero / About SAHAJ", value: "hero" },
          { title: "Partnership Story", value: "partnership_story" },
          { title: "White Glove Installation", value: "white_glove" },
          { title: "The Space", value: "the_space" },
          { title: "CTA Section", value: "cta" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title / Heading",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body Content",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
  ],
});
