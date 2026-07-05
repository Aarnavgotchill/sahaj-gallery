import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";

const VALID_SLUGS = ["s", "a", "h", "a-2", "j"] as const;
type ArtSlug = (typeof VALID_SLUGS)[number];

const Page = lazy(() => import("./art-viewer-page"));

export const Route = createFileRoute("/art-viewer")({
  validateSearch: (
    search: Record<string, string | undefined>,
  ): { slug: ArtSlug } => {
    const raw = search.slug;
    const slug = raw && VALID_SLUGS.includes(raw as ArtSlug)
      ? (raw as ArtSlug)
      : "s";
    return { slug };
  },
  head: () => ({
    meta: [
      { title: "Art Viewer   Sahaj Gallery" },
      {
        name: "description",
        content: "Explore artworks at Sahaj Gallery.",
      },
    ],
  }),
  component: Page,
});

export type { ArtSlug };
