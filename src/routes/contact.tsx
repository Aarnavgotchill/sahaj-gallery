import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";

const Page = lazy(() => import("./contact-page"));

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact   Sahaj Gallery" },
      { name: "description", content: "Get in touch with Sahaj Gallery." },
    ],
  }),
  component: Page,
});
