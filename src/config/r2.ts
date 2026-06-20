const BASE = import.meta.env.VITE_R2_URL || "";

export const r2 = {
  hero: (file: string) => `${BASE}/hero/${file}`,
  artworks: (file: string) => `${BASE}/artworks/${file}`,
  artists: (file: string) => `${BASE}/artists/${file}`,
  exhibitions: (file: string) => `${BASE}/exhibitions/${file}`,
  videos: (file: string) => `${BASE}/videos/${file}`,
  logos: (file: string) => `${BASE}/logos/${file}`,
  fonts: (file: string) => `${BASE}/fonts/${file}`,
  sahajPanel: (file: string) => `${BASE}/sahaj-panel/${file}`,
  essentials: (file: string) => `${BASE}/essentials/${file}`,
  thumbnails: (file: string) => `${BASE}/thumbnails/${file}`,
  audio: (file: string) => `${BASE}/audio/${file}`,
  gallery: (file: string) => `${BASE}/gallery/${file}`,
};
