import type { Artwork } from "@/types/artist";

const BASE = "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/E%20S%20S%20E%20N%20T%20I%20A%20L%20S/essentials";

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E";

const W = 600;
const H = 700;

export const ESSENTIALS_KEYS = [
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

export type EssentialsKey = (typeof ESSENTIALS_KEYS)[number];

const _1E_IMGS = [
  `${BASE}/1E/11E.webp`,
  `${BASE}/1E/22E.webp`,
  `${BASE}/1E/33E.webp`,
];

const _2S_IMGS = [
  `${BASE}/2S/11SS.webp`,
  `${BASE}/2S/22SS.webp`,
];

const _3S_IMGS = [
  `${BASE}/3S/11SSS.webp`,
  `${BASE}/3S/22SSS.webp`,
  `${BASE}/3S/33SSS.webp`,
  `${BASE}/3S/44SSS.webp`,
  `${BASE}/3S/55SSS.webp`,
];

const _4E_IMGS = [
  `${BASE}/4E/1.webp`,
  `${BASE}/4E/2.webp`,
  `${BASE}/4E/3.webp`,
  `${BASE}/4E/4.webp`,
];

const _5N_IMGS = [
  `${BASE}/5N/1N.webp`,
  `${BASE}/5N/2N.webp`,
];

const _6T_IMGS = [
  `${BASE}/6T/1SSSS.webp`,
  `${BASE}/6T/2SSSS.webp`,
  `${BASE}/6T/3SSSS.webp`,
];

const _9L_IMGS = [
  `${BASE}/8A/11EE.webp`,
  `${BASE}/8A/22EE.webp`,
  `${BASE}/8A/33EE.webp`,
  `${BASE}/8A/44EE.webp`,
  `${BASE}/8A/55EE.webp`,
];

function imgsToArtworks(imgs: string[], prefix: string, startIdx = 1): Artwork[] {
  return imgs.map((img, i) => ({
    id: `${prefix}-${startIdx + i}`,
    catalogNo: `${prefix.toUpperCase()} / ${String(startIdx + i).padStart(3, "0")}`,
    title: `Art ${startIdx + i}`,
    year: "",
    medium: "",
    dimensions: "",
    image: img,
    width: W,
    height: H,
  }));
}

function mkPlaceholderArtworks(count: number, prefix: string, startIdx = 1): Artwork[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-ph-${startIdx + i}`,
    catalogNo: `${prefix.toUpperCase()} / ${String(startIdx + i).padStart(3, "0")}`,
    title: "Coming Soon",
    year: "",
    medium: "",
    dimensions: "",
    image: PLACEHOLDER_IMG,
    width: W,
    height: H,
  }));
}

const ESS_1E_ART = imgsToArtworks(_1E_IMGS, "E", 1);
const ESS_2S_ART = imgsToArtworks(_2S_IMGS, "S", 1);
const ESS_3S_ART = imgsToArtworks(_3S_IMGS, "S", 5);
const ESS_4E_ART = imgsToArtworks(_4E_IMGS, "E", 9);
const ESS_5N_ART = imgsToArtworks(_5N_IMGS, "N", 13);
const ESS_6T_ART = imgsToArtworks(_6T_IMGS, "T", 1);
const _7I_IMGS = [
  `${BASE}/7I/11T.webp`,
  `${BASE}/7I/22T.webp`,
];
const ESS_7I_ART = imgsToArtworks(_7I_IMGS, "I", 1);
const ESS_8A_ART = mkPlaceholderArtworks(5, "A", 1);
const ESS_9L_ART = imgsToArtworks(_9L_IMGS, "L", 1);
const _10S_IMGS = [
  `${BASE}/10S/11SSSS.webp`,
  `${BASE}/10S/22SSSS.webp`,
  `${BASE}/10S/33SSSS.webp`,
];
const ESS_10S_ART = imgsToArtworks(_10S_IMGS, "S", 1);

export interface EssentialsEntryData {
  key: EssentialsKey;
  letter: string;
  name: string;
  artworks: Artwork[];
  isPlaceholder?: boolean;
  lightboxDimensions?: { width: number; height: number };
  lightboxAspectRatio?: string;
}

export const ESSENTIALS_ENTRIES: EssentialsEntryData[] = [
  { key: "ess_1e", letter: "E", name: "1E", artworks: ESS_1E_ART, lightboxDimensions: { width: 575, height: 475 }, lightboxAspectRatio: "9/16" },
  { key: "ess_2s", letter: "S", name: "2S", artworks: ESS_2S_ART, lightboxDimensions: { width: 575, height: 475 }, lightboxAspectRatio: "9/16" },
  { key: "ess_3s", letter: "S", name: "3S", artworks: ESS_3S_ART, lightboxDimensions: { width: 1200, height: 475 }, lightboxAspectRatio: "16/9" },
  { key: "ess_4e", letter: "E", name: "4E", artworks: ESS_4E_ART, lightboxDimensions: { width: 575, height: 475 }, lightboxAspectRatio: "9/16" },
  { key: "ess_5n", letter: "N", name: "5N", artworks: ESS_5N_ART, lightboxDimensions: { width: 575, height: 475 }, lightboxAspectRatio: "9/16" },
  { key: "ess_6t", letter: "T", name: "6T", artworks: ESS_6T_ART, lightboxDimensions: { width: 575, height: 475 }, lightboxAspectRatio: "9/16" },
  { key: "ess_7i", letter: "I", name: "7I", artworks: ESS_7I_ART, lightboxDimensions: { width: 575, height: 475 }, lightboxAspectRatio: "9/16" },
  { key: "ess_8a", letter: "A", name: "8A", artworks: ESS_8A_ART, isPlaceholder: true, lightboxDimensions: { width: 1920, height: 1720 }, lightboxAspectRatio: "4/3" },
  { key: "ess_9l", letter: "L", name: "9L", artworks: ESS_9L_ART, lightboxDimensions: { width: 1400, height: 700 }, lightboxAspectRatio: "16/9" },
  { key: "ess_10s", letter: "S", name: "10S", artworks: ESS_10S_ART, lightboxDimensions: { width: 575, height: 475 }, lightboxAspectRatio: "9/16" },
];

export const NAV_LETTERS = ESSENTIALS_ENTRIES.map((e) => ({
  key: e.key,
  label: e.letter,
}));

export function getEssentialsEntry(key: string): EssentialsEntryData | undefined {
  return ESSENTIALS_ENTRIES.find((e) => e.key === key);
}
