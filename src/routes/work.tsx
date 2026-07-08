import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";

const VALID_CATEGORY_IDS = [
  "eyes",
  "shreenathji",
  "shikshapatri",
  "reflection",
  "cherry",
] as const;

type CategoryId = (typeof VALID_CATEGORY_IDS)[number];

const CATEGORY_ALIASES: Record<string, CategoryId> = {
  eyes: "eyes",
  "the eyes": "eyes",
  shreenathji: "shreenathji",
  "the shreenathji grace": "shreenathji",
  shikshapatri: "shikshapatri",
  "the shikshapatri": "shikshapatri",
  sikshapatri: "shikshapatri",
  "the sikshapatri": "shikshapatri",
  reflection: "reflection",
  "the reflection": "reflection",
  cherry: "cherry",
  "cherry blossom": "cherry",
  urban: "shreenathji",
  "the urban": "shreenathji",
};

function resolveCategoryId(raw?: string): CategoryId | undefined {
  if (!raw) return undefined;
  const normalized = raw.toLowerCase().trim();
  if (CATEGORY_ALIASES[normalized]) return CATEGORY_ALIASES[normalized];
  return VALID_CATEGORY_IDS.includes(normalized as CategoryId)
    ? (normalized as CategoryId)
    : undefined;
}

const ESSENTIALS_KEYS = [
  "ess_1e",
  "ess_2s",
  "ess_3s",
  "ess_4e",
  "ess_5n",
  "ess_6t",
  "ess_7i",
  "ess_8a",
  "ess_9l",
  "ess_10s",
] as const;
type EssentialsKey = (typeof ESSENTIALS_KEYS)[number];

const Page = lazy(() => import("./work-page"));

export const Route = createFileRoute("/work")({
  validateSearch: (
    search: Record<string, string | undefined>,
  ): { c?: CategoryId; e?: EssentialsKey } => {
    const c = resolveCategoryId(search.c ?? search.category);
    const raw = search.e;
    const e =
      raw && (ESSENTIALS_KEYS as readonly string[]).includes(raw)
        ? (raw as EssentialsKey)
        : undefined;
    return { ...(c ? { c } : {}), ...(e ? { e } : {}) };
  },
  head: () => ({
    meta: [
      { title: "Gallery   Sahaj Gallery" },
      {
        name: "description",
        content:
          "Browse the full collection of works at Sahaj Gallery in Ahmedabad.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@200;300;400&display=swap",
      },
    ],
  }),
  component: Page,
});
