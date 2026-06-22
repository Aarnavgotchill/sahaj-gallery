const R2_URL = import.meta.env.VITE_R2_URL;
const DEV = import.meta.env.DEV;

function toLocalPath(r2Segments: string[]): string {
  const joined = r2Segments.join("/");
  return joined
    .replace(/^artworks\/sahaj_gallery_panel\//, "sahaj panel/")
    .replace(/^artworks\/essentials\//, "ESSENTIALS/")
    .replace(/^images\/home_page\//, "home page/")
    .replace(/^videos\/reviews\//, "Review Video/");
}

function buildUrl(...segments: string[]): string {
  if (DEV || !R2_URL) {
    const localPath = toLocalPath(segments);
    return `/src/assets/${localPath}`;
  }
  const path = segments.filter(Boolean).join("/");
  const base = R2_URL.replace(/\/+$/, "");
  const url = `${base}/${path}`;
  try {
    new URL(url);
  } catch {
    console.warn(`[R2] Invalid asset URL: ${url}`);
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

export const R2_BASE_URL = R2_URL || "";
