import { r2 } from "@/config/r2";

// ─── Logos & Branding ───
export const sahajTransparentLogo = r2.homePage("sahaj-trasnparent-logo.png");
export const ndhLogo4K = r2.homePage("NDH_logo_4K.png");
export const studioShikshaptriLogo = r2.homePage("Studio_Shikshaptri_white_4K.png");
export const karigariLogo = r2.homePage("karigari-logo-png.webp");

// ─── Hero ───
export const heroVideo = r2.hero("hero-video.mp4");
export const heroImage = r2.images("hero.jpg");
export const heroMedium = r2.images("hero-medium.webp");
export const heroThumb = r2.images("hero-thumb.webp");

// ─── Homepage Artworks (Spotlight) ───
export const artworkSpotlight1 = r2.homePage("ART-WORK-1-medium.webp");
export const artworkSpotlight2 = r2.homePage("ART-WORK-2-medium.webp");
export const artworkSpotlight3 = r2.homePage("ART-WORK-3-medium.webp");
export const artworkSpotlight1Full = r2.homePage("ART-WORK-1.png");
export const artworkSpotlight2Full = r2.homePage("ART-WORK-2.png");
export const artworkSpotlight3Full = r2.homePage("ART-WORK-3.png");

// ─── SAHAJ Panel Strip Backgrounds (Category Cards) ───
export const stripS = r2.homePage("S-medium.webp");
export const stripA = r2.homePage("A-medium.webp");
export const stripH = r2.homePage("H-medium.webp");
export const stripA1 = r2.homePage("A1-medium.webp");
export const stripJ = r2.homePage("J-medium.webp");

// ─── Sahaj Panel Artworks (The Eyes - 1S) ───
function sahajPanelEyes(i: number) {
  return r2.sahajPanel(`1S/S${i}.JPG`);
}
export const eyesArtworks = Array.from({ length: 10 }, (_, i) =>
  sahajPanelEyes(i + 1),
);

// ─── Sahaj Panel Artworks (Shreenathji - 2A) ───
export const shreenathjiArtworks = [
  r2.sahajPanel("2A/1A.JPG"),
  r2.sahajPanel("2A/2A.JPG"),
];

// ─── Sahaj Panel Artworks (Sikshapatri - 3H) ───
export const sikshapatriArtworks = Array.from({ length: 10 }, (_, i) =>
  r2.sahajPanel(`3H/${i + 1}H.JPG`),
);

// ─── Sahaj Panel Artworks (Reflection - 4A) ───
export const reflectionArtworks = Array.from({ length: 9 }, (_, i) =>
  r2.sahajPanel(`4A/${i + 1}AA.JPG`),
);

// ─── Sahaj Panel Artworks (Cherry Blossom - 5J) ───
export const cherryBlossomArtworks = Array.from({ length: 10 }, (_, i) =>
  r2.sahajPanel(`5J/${i + 1}J.jpg`),
);

// ─── Essentials Section Artworks ───
export const essentials6E = [
  r2.essentials("6E/Handle 1.png"),
  r2.essentials("6E/Handle 2.png"),
  r2.essentials("6E/Handle 3.png"),
  r2.essentials("6E/Handle 4.png"),
];

export const essentials7S = [
  r2.essentials("7S/1SS.png"),
  r2.essentials("7S/2SS.png"),
];

export const essentials8S = [
  r2.essentials("8S/1SSS.png"),
  r2.essentials("8S/2SSS.png"),
  r2.essentials("8S/3SSS.png"),
];

export const essentials9E = [
  r2.essentials("9E/1EE.png"),
  r2.essentials("9E/2EE.png"),
  r2.essentials("9E/3EE.png"),
  r2.essentials("9E/4EE.png"),
];

export const essentials10N = [
  r2.essentials("10N/1N.png"),
  r2.essentials("10N/2N.png"),
];

export const essentials11T = [
  r2.essentials("11T/1T.png"),
  r2.essentials("11T/2T.png"),
];

// ─── Placeholder / Gallery Images ───
export const sahajGalleryPlaceholder = r2.placeholder("sahaj-gallery-placeholder.webp");
export const sahajFinalPlaceholder = r2.images("placeholder/sahaj-final-placeholder.jpg");
export const galleryBackground = r2.images("gallery-background.jpg");

// ─── Videos ───
export const fenilTestimonialVideo = r2.videos("fenil-video.mp4");
export const dhrutiTestimonialVideo = r2.videos("Dhruit-Panchal-V1.mp4");
export const handsOfSahajVideo = r2.videos("The-Hands-of-Sahaj.mp4");

// ─── Audio ───
export const ambientAudio = r2.audio("Cinematic-Ambient-Background-Music.mp3");

// ─── Fonts (referenced via styles.css but listed here for completeness) ───
export const gambettaFont = r2.fonts("Gambetta-Medium.otf");
export const microssFont = r2.fonts("micross.ttf");
