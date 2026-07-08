import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";

const Page = lazy(() => import("./our-team-page"));

export const Route = createFileRoute("/our-team")({
  head: () => ({
    meta: [
      { title: "Our Team   Sahaj Gallery" },
      {
        name: "description",
        content: "Meet the team behind Sahaj Gallery and Urbscapes Studio in Ahmedabad.",
      },
    ],
  }),
  component: Page,
});
