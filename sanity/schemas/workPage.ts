import { defineType, defineField } from "sanity";

export default defineType({
  name: "workPage",
  title: "Work / Gallery Page",
  type: "document",
  fields: [
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "string",
      initialValue: "A NDH HOUSE PARTNERSHIP",
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
      initialValue: "Gallery",
    }),
    defineField({
      name: "contactKicker",
      title: "Contact Section Kicker",
      type: "string",
      initialValue: "LET'S GET IN TOUCH!",
    }),
    defineField({
      name: "contactTitle",
      title: "Contact Section Title",
      type: "text",
      initialValue: "We'd love\nto hear\nfrom you",
    }),
    defineField({
      name: "contactTitleItalic",
      title: "Contact Title Italic Word",
      type: "string",
      initialValue: "from you",
    }),
    defineField({
      name: "addressLabel",
      title: "Address Label",
      type: "string",
      initialValue: "Address",
    }),
    defineField({
      name: "phoneLabel",
      title: "Phone Label",
      type: "string",
      initialValue: "Phone",
    }),
    defineField({
      name: "emailLabel",
      title: "Email Label",
      type: "string",
      initialValue: "Email",
    }),
    defineField({
      name: "hoursLabel",
      title: "Hours Label",
      type: "string",
      initialValue: "Hours",
    }),
    defineField({
      name: "directionButtonText",
      title: "Directions Button Text",
      type: "string",
      initialValue: "Get Directions",
    }),
    defineField({
      name: "mapUrl",
      title: "Google Maps URL",
      type: "url",
      initialValue: "https://www.google.com/maps?um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KWNN2o4_m145MTOJ5URhNfzK&daddr=Shop+-+02,+Palak+Prime,+Ambli+Rd,+opp.+DoubleTree+by+Hilton+Hotel,+nr.+Antriksh+colony+BRTS+Bus+Stand,+Ambli,+Ahmedabad,+Gujarat+380058",
    }),
    defineField({
      name: "submitButtonText",
      title: "Submit Button Text",
      type: "string",
      initialValue: "Send Me Quotes!",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "linkedinLabel",
      title: "LinkedIn Label",
      type: "string",
      initialValue: "LinkedIn",
    }),
    defineField({
      name: "footerText",
      title: "Footer Text",
      type: "string",
      initialValue: "Art Gallery · Ahmedabad, Gujarat",
    }),
  ],
});
