import { defineType, defineField } from "sanity";

export default defineType({
  name: "galleryImage",
  title: "Gallery Image",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Artwork Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "THE EYES", value: "THE EYES" },
          { title: "THE URBAN", value: "THE URBAN" },
          { title: "THE SIKSHAPATRI", value: "THE SIKSHAPATRI" },
          { title: "THE REFLECTION", value: "THE REFLECTION" },
          { title: "CHERRY BLOSSOM", value: "CHERRY BLOSSOM" },
          { title: "SREEYANTRA", value: "SREEYANTRA" },
          { title: "SERENE WOODLAND", value: "SERENE WOODLAND" },
          { title: "TRIBAL ART", value: "TRIBAL ART" },
          { title: "AUTUMN", value: "AUTUMN" },
          { title: "SARANAM", value: "SARANAM" },
          { title: "PARIJAT", value: "PARIJAT" },
          { title: "FLORA", value: "FLORA" },
          { title: "PRAKRITI MANDALA", value: "PRAKRITI MANDALA" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
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
