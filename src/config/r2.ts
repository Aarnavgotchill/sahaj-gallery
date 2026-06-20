const BASE = import.meta.env.VITE_R2_URL || "https://assets.sahajgallery.com";

export const r2 = {
  artworks: (file: string) => `${BASE}/artworks/${file}`,
  sahajPanel: (file: string) => `${BASE}/artworks/sahaj_gallery_panel/${file}`,
  essentials: (file: string) => `${BASE}/artworks/essentials/${file}`,
  hero: (file: string) => `${BASE}/hero/${file}`,
  images: (file: string) => `${BASE}/images/${file}`,
  placeholder: (file: string) => `${BASE}/images/placeholder/${file}`,
  homePage: (file: string) => `${BASE}/images/home_page/${file}`,
  videos: (file: string) => `${BASE}/videos/reviews/${file}`,
  fonts: (file: string) => `${BASE}/fonts/${file}`,
  audio: (file: string) => `${BASE}/audio/${file}`,
};
