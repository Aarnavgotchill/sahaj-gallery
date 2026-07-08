import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ESSENTIALS_KEYS } from "@/data/essentialsData";
import type { EssentialsKey } from "@/data/essentialsData";

const Page = lazy(() => import("./essentials-viewer-page"));

export const Route = createFileRoute("/essentials-viewer")({
  validateSearch: (
    search: Record<string, string | undefined>,
  ): { e: EssentialsKey } => {
    const raw = search.e;
    const e =
      raw && ESSENTIALS_KEYS.includes(raw as EssentialsKey)
        ? (raw as EssentialsKey)
        : "ess_1e";
    return { e };
  },
  head: () => ({
    meta: [
      { title: "Essentials   Sahaj Gallery" },
      {
        name: "description",
        content: "Explore the essentials collection at Sahaj Gallery.",
      },
    ],
  }),
  component: Page,
});
