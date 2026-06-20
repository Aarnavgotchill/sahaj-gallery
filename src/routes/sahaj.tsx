import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";

const Page = lazy(() => import("./sahaj-page"));

export const Route = createFileRoute("/sahaj")({
  head: () => ({
    meta: [
      { title: "About Sahaj   Sahaj Gallery" },
      {
        name: "description",
        content:
          "Sahaj is a sanctuary for contemporary art   a quiet collaboration between NDH House and Sahaj Gallery in Ahmedabad.",
      },
    ],
  }),
  component: Page,
});
