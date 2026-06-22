const BASE = import.meta.env.VITE_R2_URL || "https://pub-88b77a3c95f846c492b24221cd5ed074.r2.dev";

function buildUrl(...segments: string[]): string {
  const path = segments.filter(Boolean).join("/");
  const url = `${BASE.replace(/\/+$/, "")}/${path}`;
  try {
    new URL(url);
  } catch {
    console.warn(`[R2] Invalid asset URL constructed: ${url}`);
  }
  return url;
}

export const r2 = {
  artworks: (file: string) => buildUrl("artworks", file),
  sahajPanel: (file: string) => buildUrl("artworks", "sahaj_gallery_panel", file),
  essentials: (file: string) => buildUrl("artworks", "essentials", file),
  hero: (file: string) => buildUrl("hero", file),
  images: (file: string) => buildUrl("images", file),
  placeholder: (file: string) => buildUrl("images", "placeholder", file),
  homePage: (file: string) => buildUrl("images", "home_page", file),
  videos: (file: string) => buildUrl("videos", "reviews", file),
  fonts: (file: string) => buildUrl("fonts", file),
  audio: (file: string) => buildUrl("audio", file),
};

export const R2_BASE_URL = BASE;
