import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";

const Page = lazy(() => import("./index-page"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sahaj Gallery   A Sanctuary for Contemporary Art" },
      {
        name: "description",
        content:
          "Sahaj is a quiet gallery devoted to emotional storytelling, architectural integration, and the timeless presence of contemporary art.",
      },
      {
        property: "og:title",
        content: "Sahaj Gallery   A Sanctuary for Contemporary Art",
      },
      {
        property: "og:description",
        content:
          "An immersive, museum-inspired experience devoted to stillness, story, and the inner life of art.",
      },
      {
        property: "og:image",
        content: "https://sahaj-gallery.vercel.app/og-image.jpg",
      },
    ],
  }),
  component: Page,
});
