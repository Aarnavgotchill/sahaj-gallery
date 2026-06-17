import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "Where beauty exist without effort",
    }),
    defineField({
      name: "philosophyTitle",
      title: "Philosophy Title",
      type: "string",
      initialValue: "Why The Name Sahaj ?",
    }),
    defineField({
      name: "philosophySubtitle",
      title: "Philosophy Subtitle",
      type: "string",
      initialValue: "So here's the story.",
    }),
    defineField({
      name: "philosophyBody",
      title: "Philosophy Body",
      type: "array",
      of: [{ type: "text" }],
      initialValue: [
        "Sahaj, in its simplest form, means natural. Effortless. The way things are meant to be… without force, without noise.",
        "And that's exactly how we see art.",
        'Not something that should feel complicated or intimidating. Not something you have to "understand" to appreciate. But something you feel instantly. Something that just fits… into your space, into your life.',
      ],
    }),
    defineField({
      name: "logoTitle",
      title: "Why These Logo Title",
      type: "string",
      initialValue: "Why These Logo ?",
    }),
    defineField({
      name: "logoBody",
      title: "Logo Description",
      type: "array",
      of: [{ type: "text" }],
      initialValue: [
        'And then there\'s our logo… the Hansa.',
        "In Indian philosophy, the Hansa (swan) symbolizes purity, grace, and the rare ability to separate the essential from the trivial. It's often seen as a symbol of wisdom and higher taste.",
      ],
    }),
    defineField({
      name: "featuredWorksTitle",
      title: "Featured Works Title",
      type: "string",
      initialValue: "A measured silence, hung in light.",
    }),
    defineField({
      name: "contactAddress",
      title: "Contact Address",
      type: "text",
      initialValue: "Shop - 02, Palak Prime, Ambli Rd\nOpp. DoubleTree by Hilton Hotel\nNr. Antriksh Colony BRTS Bus Stand\nAmbli, Ahmedabad, Gujarat 380058",
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
      initialValue: "+91 95107 88933",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      initialValue: "info@sahajgallery.in",
    }),
    defineField({
      name: "contactHours",
      title: "Contact Hours",
      type: "string",
      initialValue: "Opens at 10:30 AM · Closes at 7:30 PM",
    }),
    defineField({
      name: "heroVideo",
      title: "Hero Video",
      type: "file",
      options: { accept: "video/mp4" },
    }),
  ],
});
