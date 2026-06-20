import { useState, useEffect, useRef, useCallback, lazy } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import ndhLogo from "@/assets/NDH_logo_4K.png";

const WebGLGallery = lazy(() => import("@/components/WebGLGallery"));
const CataloguePopup = lazy(() => import("@/components/CataloguePopup"));

const VALID_CATEGORY_IDS = [
  "eyes",
  "shreenathji",
  "sikshapatri",
  "reflection",
  "cherry",
] as const;

type CategoryId = (typeof VALID_CATEGORY_IDS)[number];

const CATEGORY_ALIASES: Record<string, CategoryId> = {
  eyes: "eyes",
  "the eyes": "eyes",
  shreenathji: "shreenathji",
  "the shreenathji grace": "shreenathji",
  sikshapatri: "sikshapatri",
  "the sikshapatri": "sikshapatri",
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

export type { CategoryId };

/* ─── DATA ─── */

interface EyeArtwork {
  title: string;
  sub: string;
  desc: string;
  dim: string;
  glow: string;
  svg?: string;
  image?: string;
  imageThumb?: string;
  imageMedium?: string;
  placeholder?: boolean;
}

function mkPlaceholders(
  count: number,
  baseTitle: string,
  baseSub: string,
  glow: string,
  startAt = 1,
): EyeArtwork[] {
  return Array.from({ length: count }, (_, i) => ({
    title: `${baseTitle} ${startAt + i}`,
    sub: `${baseSub}  ${String(startAt + i).padStart(2, "0")}`,
    desc: "coming soon",
    dim: " ",
    glow,
    placeholder: true,
  }));
}

// S  Eyes - 10 images from sahaj panel/1S
const S_IMG = [
  new URL("../assets/sahaj panel/1S/S1.JPG", import.meta.url).href,
  new URL("../assets/sahaj panel/1S/S2.JPG", import.meta.url).href,
  new URL("../assets/sahaj panel/1S/S3.JPG", import.meta.url).href,
  new URL("../assets/sahaj panel/1S/S4.JPG", import.meta.url).href,
  new URL("../assets/sahaj panel/1S/S5.JPG", import.meta.url).href,
  new URL("../assets/sahaj panel/1S/S6.JPG", import.meta.url).href,
  new URL("../assets/sahaj panel/1S/S7.jpg", import.meta.url).href,
  new URL("../assets/sahaj panel/1S/S8.JPG", import.meta.url).href,
  new URL("../assets/sahaj panel/1S/S9.jpg", import.meta.url).href,
  new URL("../assets/sahaj panel/1S/S10.jpg", import.meta.url).href,
];
const EYE_ART: EyeArtwork[] = S_IMG.map((img, i) => ({
  title: `Eyes Study ${i + 1}`,
  sub: `E Y E S  ${String(i + 1).padStart(2, "0")}`,
  desc: "artwork",
  dim: " ",
  glow: "#b87c4a",
  image: img,
}));

// A  Shreenathji - 2 images from sahaj panel/2A + 8 placeholders
const SHRG_IMGS = Array.from({ length: 2 }, (_, i) =>
  new URL(`../assets/sahaj panel/2A/${i + 1}A.JPG`, import.meta.url).href,
);
const THE_SHREENATHJI_GRACE_ART: EyeArtwork[] = [
  ...SHRG_IMGS.map((img, i) => ({
    title: `Shreenathji ${i + 1}`,
    sub: `S H R E E N A T H J I  ${String(i + 1).padStart(2, "0")}`,
    desc: "artwork",
    dim: " ",
    glow: "#c9a96e",
    image: img,
  })),
  ...mkPlaceholders(8, "Shreenathji", "S H R E E N A T H J I", "#c9a96e", 3),
];

// H  Sikshapatri - 10 images from sahaj panel/3H
const THE_SIKSHAPATRI_ART: EyeArtwork[] = Array.from(
  { length: 10 },
  (_, i) => ({
    title: `Sikshapatri Study ${i + 1}`,
    sub: `S I K S H A P A T R I  ${String(i + 1).padStart(2, "0")}`,
    desc: "artwork",
    dim: " ",
    glow: "#8a6020",
    image: new URL(
      `../assets/sahaj panel/3H/${i + 1}H.JPG`,
      import.meta.url,
    ).href,
  }),
);

// A (index 3)  Reflection - 9 images from sahaj panel/4A + 1 placeholder
const REF_IMGS = Array.from({ length: 9 }, (_, i) =>
  new URL(`../assets/sahaj panel/4A/${i + 1}AA.JPG`, import.meta.url).href,
);
const THE_REFLECTION_ART: EyeArtwork[] = [
  ...REF_IMGS.map((img, i) => ({
    title: `Reflection Series ${i + 1}`,
    sub: `R E F L E C T I O N  ${String(i + 1).padStart(2, "0")}`,
    desc: "artwork",
    dim: " ",
    glow: "#206a8a",
    image: img,
  })),
  ...mkPlaceholders(1, "Reflection Series", "R E F L E C T I O N", "#206a8a", 10),
];

// J  Cherry Blossom - 10 images from sahaj panel/5J
const CB_J_IMGS = [
  new URL("../assets/sahaj panel/5J/1J.jpg", import.meta.url).href,
  new URL("../assets/sahaj panel/5J/2J.jpg", import.meta.url).href,
  new URL("../assets/sahaj panel/5J/3J.jpg", import.meta.url).href,
  new URL("../assets/sahaj panel/5J/4J.jpg", import.meta.url).href,
  new URL("../assets/sahaj panel/5J/5J.jpeg", import.meta.url).href,
  new URL("../assets/sahaj panel/5J/6J.jpeg", import.meta.url).href,
  new URL("../assets/sahaj panel/5J/7J.jpg", import.meta.url).href,
  new URL("../assets/sahaj panel/5J/8J.jpg", import.meta.url).href,
  new URL("../assets/sahaj panel/5J/9J.jpeg", import.meta.url).href,
  new URL("../assets/sahaj panel/5J/10J.jpg", import.meta.url).href,
];
const CHERRY_BLOSSOM_ART: EyeArtwork[] = CB_J_IMGS.map((img, i) => ({
  title: `Cherry Blossom ${i + 1}`,
  sub: `C H E R R Y  B L O S S O M  ${String(i + 1).padStart(2, "0")}`,
  desc: "artwork",
  dim: " ",
  glow: "#d08080",
  image: img,
}));

const CATEGORIES = [
  {
    id: "eyes",
    label: "The Eyes",
    artworks: EYE_ART,
    letter: "S",
    img: "S",
  },
  {
    id: "shreenathji",
    label: "The Shreenathji Grace",
    artworks: THE_SHREENATHJI_GRACE_ART,
    letter: "A",
    img: "A",
  },
  {
    id: "sikshapatri",
    label: "The Sikshapatri",
    artworks: THE_SIKSHAPATRI_ART,
    letter: "H",
    img: "H",
  },
  {
    id: "reflection",
    label: "The Reflection",
    artworks: THE_REFLECTION_ART,
    letter: "A",
    img: "A1",
  },
  {
    id: "cherry",
    label: "Cherry Blossom",
    artworks: CHERRY_BLOSSOM_ART,
    letter: "J",
    img: "J",
  },
] as const;

/* ─── ESSENTIALS DATA ─── */

const ESSENTIALS_KEYS = [
  "ess_6e",
  "ess_7s",
  "ess_8s",
  "ess_9e",
  "ess_10n",
  "ess_11t",
  "ess_12i",
  "ess_13a",
  "ess_14l",
  "ess_15s",
] as const;
type EssentialsKey = (typeof ESSENTIALS_KEYS)[number];

const ESSENTIALS_GLOW = "#c9a96e";

const _6E_IMGS = [
  new URL("../assets/ESSENTIALS/6E/Handle 1.png", import.meta.url).href,
  new URL("../assets/ESSENTIALS/6E/Handle 2.png", import.meta.url).href,
  new URL("../assets/ESSENTIALS/6E/Handle 3.png", import.meta.url).href,
  new URL("../assets/ESSENTIALS/6E/Handle 4.png", import.meta.url).href,
];
const ESS_6E_ART: EyeArtwork[] = [
  ..._6E_IMGS.map((img, i) => ({
    title: `Handle ${i + 1}`,
    sub: `E 0 1  ${String(i + 1).padStart(2, "0")}`,
    desc: "artwork",
    dim: " ",
    glow: ESSENTIALS_GLOW,
    image: img,
  })),
  ...mkPlaceholders(1, "Handle", "E 0 1", ESSENTIALS_GLOW, 5),
];

const _7S_IMGS = [
  new URL("../assets/ESSENTIALS/7S/1SS.png", import.meta.url).href,
  new URL("../assets/ESSENTIALS/7S/2SS.png", import.meta.url).href,
];
const ESS_7S_ART: EyeArtwork[] = [
  ..._7S_IMGS.map((img, i) => ({
    title: `S ${i + 1}`,
    sub: `S 0 2  ${String(i + 1).padStart(2, "0")}`,
    desc: "artwork",
    dim: " ",
    glow: ESSENTIALS_GLOW,
    image: img,
  })),
  ...mkPlaceholders(3, "S", "S 0 2", ESSENTIALS_GLOW, 3),
];

const _8S_IMGS = [
  new URL("../assets/ESSENTIALS/8S/1SSS.png", import.meta.url).href,
  new URL("../assets/ESSENTIALS/8S/2SSS.png", import.meta.url).href,
  new URL("../assets/ESSENTIALS/8S/3SSS.png", import.meta.url).href,
];
const ESS_8S_ART: EyeArtwork[] = [
  ..._8S_IMGS.map((img, i) => ({
    title: `SS ${i + 1}`,
    sub: `S 0 3  ${String(i + 1).padStart(2, "0")}`,
    desc: "artwork",
    dim: " ",
    glow: ESSENTIALS_GLOW,
    image: img,
  })),
  ...mkPlaceholders(2, "SS", "S 0 3", ESSENTIALS_GLOW, 4),
];

const _9E_IMGS = [
  new URL("../assets/ESSENTIALS/9E/1EE.png", import.meta.url).href,
  new URL("../assets/ESSENTIALS/9E/2EE.png", import.meta.url).href,
  new URL("../assets/ESSENTIALS/9E/3EE.png", import.meta.url).href,
  new URL("../assets/ESSENTIALS/9E/4EE.png", import.meta.url).href,
];
const ESS_9E_ART: EyeArtwork[] = [
  ..._9E_IMGS.map((img, i) => ({
    title: `EE ${i + 1}`,
    sub: `E 0 4  ${String(i + 1).padStart(2, "0")}`,
    desc: "artwork",
    dim: " ",
    glow: ESSENTIALS_GLOW,
    image: img,
  })),
  ...mkPlaceholders(1, "EE", "E 0 4", ESSENTIALS_GLOW, 5),
];

const _10N_IMGS = [
  new URL("../assets/ESSENTIALS/10N/1N.png", import.meta.url).href,
  new URL("../assets/ESSENTIALS/10N/2N.png", import.meta.url).href,
];
const ESS_10N_ART: EyeArtwork[] = [
  ..._10N_IMGS.map((img, i) => ({
    title: `N ${i + 1}`,
    sub: `N 0 5  ${String(i + 1).padStart(2, "0")}`,
    desc: "artwork",
    dim: " ",
    glow: ESSENTIALS_GLOW,
    image: img,
  })),
  ...mkPlaceholders(3, "N", "N 0 5", ESSENTIALS_GLOW, 3),
];

const _11T_IMGS = [
  new URL("../assets/ESSENTIALS/11T/1T.png", import.meta.url).href,
  new URL("../assets/ESSENTIALS/11T/2T.png", import.meta.url).href,
];
const ESS_11T_ART: EyeArtwork[] = [
  ..._11T_IMGS.map((img, i) => ({
    title: `T ${i + 1}`,
    sub: `T 0 6  ${String(i + 1).padStart(2, "0")}`,
    desc: "artwork",
    dim: " ",
    glow: ESSENTIALS_GLOW,
    image: img,
  })),
  ...mkPlaceholders(3, "T", "T 0 6", ESSENTIALS_GLOW, 3),
];

const ESS_12I_ART: EyeArtwork[] = mkPlaceholders(
  5,
  "I",
  "I 0 7",
  ESSENTIALS_GLOW,
  1,
);
const ESS_13A_ART: EyeArtwork[] = mkPlaceholders(
  5,
  "A",
  "A 0 8",
  ESSENTIALS_GLOW,
  1,
);
const ESS_14L_ART: EyeArtwork[] = mkPlaceholders(
  5,
  "L",
  "L 0 9",
  ESSENTIALS_GLOW,
  1,
);
const ESS_15S_ART: EyeArtwork[] = mkPlaceholders(
  5,
  "S",
  "S 1 0",
  ESSENTIALS_GLOW,
  1,
);

const ESSENTIALS_ENTRIES = [
  { key: "ess_6e", letter: "E", artworks: ESS_6E_ART },
  { key: "ess_7s", letter: "S", artworks: ESS_7S_ART },
  { key: "ess_8s", letter: "S", artworks: ESS_8S_ART },
  { key: "ess_9e", letter: "E", artworks: ESS_9E_ART },
  { key: "ess_10n", letter: "N", artworks: ESS_10N_ART },
  { key: "ess_11t", letter: "T", artworks: ESS_11T_ART },
  { key: "ess_12i", letter: "I", artworks: ESS_12I_ART },
  { key: "ess_13a", letter: "A", artworks: ESS_13A_ART },
  { key: "ess_14l", letter: "L", artworks: ESS_14L_ART },
  { key: "ess_15s", letter: "S", artworks: ESS_15S_ART },
] as const;

/* ─── CSS ─── */
const GALLERY_CSS = `
.gallery-viewport{height:100vh;display:flex;flex-direction:column;overflow-y:auto}
#gallery-root {
  --accent: #c9a96e;
  --accent2: #7a6a8e;
  --bone: #F0EFEB;
  --muted: #b0a4be;
  --ease-cin: cubic-bezier(0.77,0,0.175,1);
  --ease-soft: cubic-bezier(0.4,0,0.2,1);
  flex:1;min-height:0;
  display:flex;flex-direction:column;
  background:var(--color-background);
  color:var(--bone);
  font-family:'Montserrat',sans-serif;
  cursor:default;
}
#gallery-root .gallery-content{
  flex:1;min-height:0;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:156px 20px 50px;
  gap:0;
}
.gallery-nav-wrap[data-gallery] {
  position:relative;z-index:100;
}
.gallery-nav-wrap[data-gallery] > header {
  backdrop-filter:blur(24px) !important;
  background-color:var(--color-background) !important;
  border-bottom:1px solid rgba(90,74,110,0.5) !important;
}
#gallery-root #l1{
  flex:none;
  height:480px;
  display:flex;align-items:center;justify-content:center;
  transition:opacity .55s var(--ease-soft);
}
#gallery-root #l1.out{opacity:0;pointer-events:none}
#gallery-root .strip-row{display:flex;align-items:center;gap:10px;height:100%;max-height:100%}
#gallery-root .strip{
  position:relative;
  height:100%;width:auto;aspect-ratio:190/504;
  max-height:480px;
  overflow:hidden;
  cursor:pointer;
  border:1.2px solid transparent;
  border-radius:7px;
  background-size:cover !important;background-position:center;
  flex-shrink:0;
  transition:transform .4s cubic-bezier(0.34,1.56,0.64,1),filter .4s cubic-bezier(0.34,1.56,0.64,1),box-shadow .4s cubic-bezier(0.34,1.56,0.64,1),border-color .4s cubic-bezier(0.34,1.56,0.64,1);
}
#gallery-root .strip:hover{
  transform:scale(1.05,1.08);
  filter:brightness(1.15);
  box-shadow:0 0 20px rgba(201,169,110,.3);
  border-color:rgba(201,169,110,.25);
}
#gallery-root .strip-letter{
  position:absolute;
  top:50%;left:50%;
  transform:translate(-50%,-50%);
  font-family:'Gambetta',Georgia,serif;
  font-weight:500;
  font-size:clamp(90px,10vw,130px);
  color:transparent;
  -webkit-text-stroke:2px #F0EFEB;
  line-height:1;
  user-select:none;
  z-index:10;
}
#gallery-root .strip-num{
  position:absolute;top:10px;right:9px;
  font-size:8px;font-weight:200;letter-spacing:.28em;
  color:rgba(201,169,110,.25);z-index:10;
}
#gallery-root .gallery-close-wrap{
  position:fixed;right:28px;bottom:48px;
  z-index:60;
  opacity:0;transition:opacity .5s .35s;
}
#gallery-root #l3.in .gallery-close-wrap{opacity:1}
#gallery-root .btn-close{
  width:38px;height:38px;
  border:1px solid rgba(201,169,110,.2);
  background:var(--color-background);
  backdrop-filter:blur(10px);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;transition:border-color .3s;
  border-radius:50%;
}
#gallery-root .btn-close:hover{border-color:var(--accent)}
#gallery-root .btn-close svg{stroke:var(--muted);width:12px;height:12px;transition:stroke .3s}
#gallery-root .btn-close:hover svg{stroke:var(--accent)}
#gallery-root #l3{
  position:fixed;inset:0;
  z-index:30;
  opacity:0;pointer-events:none;
  background:var(--color-background);
  transform:scale(0.97);
  transition:opacity .5s var(--ease-soft),transform .5s cubic-bezier(0.16,1,0.3,1);
  overflow:hidden;
}
#gallery-root #l3.in{
  opacity:1;pointer-events:all;
  transform:scale(1);
}
#gallery-root #g-stage{
  position:absolute;
  top:120px;left:0;right:0;bottom:96px;
  display:flex;align-items:center;justify-content:center;
  padding:0 40px;
}
#gallery-root .artwork{
  position:absolute;
  inset:0;
  display:flex;align-items:center;justify-content:center;
  opacity:0;pointer-events:none;
  padding:0 80px;
}
#gallery-root .artwork.active{opacity:1;pointer-events:all}
#gallery-root .art-frame{
  position:relative;
  display:flex;align-items:center;justify-content:center;
  width:min(96vw,calc(100vh - 200px));
  max-height:calc(100vh - 200px);
  overflow:hidden;
}
#gallery-root .art-img{
  max-width:100%;max-height:calc(100vh - 200px);
  width:auto;height:auto;
  object-fit:contain;display:block;
}
#gallery-root .art-canvas{
  position:absolute;inset:0;
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;
}
#gallery-root .art-canvas svg{max-width:100%;max-height:100%;width:auto;height:auto}
#gallery-root .l3-counter{
  position:absolute;
  bottom:28px;
  left:50%;
  transform:translateX(-50%);
  font-size:12px;font-weight:300;letter-spacing:.4em;
  color:var(--accent);z-index:70;
  pointer-events:none;
  padding:10px 22px;
  background:rgba(26,14,40,0.88);
  backdrop-filter:blur(12px);
  border:1px solid rgba(201,169,110,.28);
  border-radius:2px;
  white-space:nowrap;
}
#gallery-root .l3-toggle-wrap{
  position:absolute;top:16px;right:16px;z-index:70;
}
#gallery-root .l3-toggle{
  font-size:9px;font-weight:200;letter-spacing:.2em;
  color:rgba(201,169,110,.5);
  background:rgba(201,169,110,.08);
  border:1px solid rgba(201,169,110,.15);
  padding:6px 14px;cursor:pointer;
  text-transform:uppercase;
  transition:color .3s,background .3s,border-color .3s;
}
#gallery-root .l3-toggle:hover{
  color:#C9A96E;
  background:rgba(201,169,110,.15);
  border-color:rgba(201,169,110,.3);
}
#gallery-root .g-arr{
  position:absolute;
  top:50%;transform:translateY(-50%);
  width:44px;height:44px;
  background:rgba(201,169,110,.04);
  border:1px solid rgba(201,169,110,.12);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;z-index:60;
  transition:background .3s, border-color .3s, opacity .3s;
}
#gallery-root .g-arr:hover{background:rgba(201,169,110,.1);border-color:rgba(201,169,110,.3)}
#gallery-root .g-arr.dim{opacity:.15;pointer-events:none}
#gallery-root .g-arr svg{stroke:var(--accent);width:18px;height:18px}
#gallery-root #ga-p{left:16px}
#gallery-root #ga-n{right:16px}
#gallery-root .art-placeholder{border:1px solid rgba(201,169,110,.08);border-radius:2px}
#gallery-root .artwork{transition:opacity .6s ease;opacity:0}
#gallery-root .artwork.active{opacity:1}
@media(max-width:767px){
  .gallery-viewport{overflow-y:auto;-webkit-overflow-scrolling:touch}
  #gallery-root .gallery-content{justify-content:flex-start;padding:100px 0 40px;gap:0}
  #gallery-root #l1{height:auto;padding:0;flex:none}
  #gallery-root .strip-row{flex-direction:column;width:100%;padding:0;gap:24px;height:auto;align-items:center}
  #gallery-root .sahaj-panel-wrap{height:auto;width:auto;flex:none;display:block}
  #gallery-root .strip{width:88vw;max-width:420px;height:auto;aspect-ratio:3/1;max-height:none;min-height:100px;border-radius:8px;position:relative;overflow:hidden;cursor:pointer;border:1.2px solid transparent;background-size:cover !important;background-position:center;flex-shrink:0;transition:transform .35s ease,filter .35s ease,box-shadow .35s ease,border-color .35s ease;margin:0 auto}
  #gallery-root .strip:active{transform:scale(0.97)}
  #gallery-root .strip-letter{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Gambetta',Georgia,serif;font-weight:500;font-size:clamp(48px,16vw,80px);color:transparent;-webkit-text-stroke:1.5px #F0EFEB;line-height:1;user-select:none;z-index:10}
  #gallery-root .strip-num{position:absolute;top:8px;right:10px;font-size:7px;font-weight:200;letter-spacing:.28em;color:rgba(201,169,110,.25);z-index:10}
  #gallery-root .essentials-section{padding:0 16px 0;margin-top:28px;text-align:center}
  #gallery-root .essentials-grid{display:grid;grid-template-columns:repeat(5,auto);gap:10px;justify-content:center;align-items:center;margin:0 auto}
  #gallery-root .essentials-box-wrap{opacity:0;transform:translateY(16px);transition:opacity .5s ease-out,transform .5s ease-out}
  #gallery-root .essentials-box-wrap.in{opacity:1;transform:translateY(0)}
  #gallery-root .essentials-box{width:44px;height:44px;border:1.2px solid rgba(201,169,110,.75);border-radius:6px;background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:border-color .3s ease,transform .3s ease,background .3s ease}
  #gallery-root .essentials-box:active{transform:scale(0.92);background:rgba(201,169,110,.08)}
  #gallery-root .essentials-box span{font-family:'Gambetta',Georgia,serif;font-size:16px;font-weight:500;letter-spacing:.02em;color:var(--bone);user-select:none}
  #gallery-root .gallery-content .btn-catalogue{display:block;margin:28px auto 0;width:calc(100vw - 48px);max-width:380px;padding:14px 20px;border:1px solid var(--gold);background:transparent;color:var(--gold);font-size:11px;letter-spacing:.3em;text-transform:uppercase;text-align:center;cursor:pointer;transition:background .4s ease,color .4s ease}
  #gallery-root .gallery-content .btn-catalogue:active{background:var(--gold);color:var(--color-background)}
  #gallery-root .gallery-footer{margin-top:36px;position:relative;bottom:auto}
  #gallery-root #g-stage{padding:0 20px}
  #gallery-root .artwork{padding:0 20px}
  #gallery-root .art-frame{width:min(85vmin,calc(100vh - 240px))}
}
#gallery-root .gallery-footer{
  transition:opacity .55s var(--ease-soft);
}
#gallery-root .gallery-footer{border-top-color:rgba(90,74,110,0.3)!important}
#gallery-root #l3::before{
  content:'';position:fixed;inset:0;z-index:5;pointer-events:none;
  background:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,0.6) 100%);
}
#gallery-root #l3::after{
  content:'';position:fixed;inset:0;z-index:5;pointer-events:none;
  background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,169,110,0.04) 0%,transparent 70%),
             radial-gradient(ellipse 60% 50% at 50% 100%,rgba(90,60,140,0.03) 0%,transparent 60%);
}
#gallery-root .sahaj-panel-wrap{
  height:100%;flex-shrink:0;
}
#gallery-root .gallery-content #l1.out ~ .essentials-section{opacity:0;pointer-events:none}
#gallery-root .essentials-section{
  padding:0 20px 24px;text-align:center;
  margin-top:30px;
  transition:opacity .55s var(--ease-soft);
}
#gallery-root .essentials-grid{
  display:flex;align-items:center;justify-content:center;gap:24px;flex-wrap:wrap;
}
#gallery-root .essentials-box{
  width:60px;height:60px;
  border:1.2px solid rgba(201,169,110,.75);
  border-radius:7px;
  background:transparent;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;
  transition:border-color .3s ease, transform .3s ease, background .3s ease, box-shadow .3s ease;
}
#gallery-root .essentials-box:hover{
  border-color:rgba(201,169,110,1);
  transform:scale(1.1, 1.03);
  background:rgba(201,169,110,.06);
  box-shadow:0 0 24px rgba(201,169,110,.08);
}
#gallery-root .essentials-box span{
  font-family:'Gambetta',Georgia,serif;
  font-size:20px;font-weight:500;
  letter-spacing:.02em;
  color:var(--bone);
  user-select:none;
}
#gallery-root .essentials-box-wrap{
  opacity:0;transform:translateY(20px);
  transition:opacity .6s ease-out,transform .6s ease-out;
}
#gallery-root .essentials-box-wrap.in{
  opacity:1;transform:translateY(0);
}
@media(min-width:768px) and (max-width:1023px){
  #gallery-root #l1{height:360px}
  #gallery-root .gallery-content{gap:0;padding:156px 20px 50px}
  #gallery-root .essentials-box{width:48px;height:48px}
  #gallery-root .essentials-box span{font-size:16px}
  #gallery-root .essentials-grid{gap:18px}
}
`;

/* ─── COMPONENT ─── */
function Work() {
  const navigate = useNavigate();
  const { c, e } = useSearch({ from: "/work" });

  const [activeIdx, setActiveIdx] = useState(0);
  const [useWebGL, setUseWebGL] = useState(false);
  const [essentialsReady, setEssentialsReady] = useState(false);
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const galleryOpen = !!c || !!e;

  const activeEssentials = e
    ? ESSENTIALS_ENTRIES.find((ent) => ent.key === e) ?? null
    : null;
  const activeCategory = !e
    ? (CATEGORIES.find((cat) => cat.id === c) ?? null)
    : null;
  const artworks = activeEssentials
    ? activeEssentials.artworks
    : activeCategory?.artworks ?? CATEGORIES[0].artworks;
  const isFirst = activeIdx === 0;
  const isLast = activeIdx === artworks.length - 1;

  useEffect(() => {
    setActiveIdx(0);
  }, [c, e]);

  useEffect(() => {
    const t = setTimeout(() => setEssentialsReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  const touchXRef = useRef(0);

  const openGallery = useCallback(
    (categoryId: string) => {
      navigate({ to: "/work", search: { c: categoryId }, replace: true });
    },
    [navigate],
  );

  const openEssentials = useCallback(
    (key: string) => {
      navigate({ to: "/work", search: { e: key }, replace: true });
    },
    [navigate],
  );

  const navImg = useCallback(
    (dir: 1 | -1) => {
      const next = activeIdx + dir;
      if (next < 0 || next >= artworks.length) return;
      setActiveIdx(next);
    },
    [activeIdx, artworks.length],
  );

  const goBack = useCallback(() => {
    navigate({ to: "/work", search: {}, replace: true });
  }, [navigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (useWebGL && galleryOpen) return;
      if (e.key === "Escape") goBack();
      if (e.key === "ArrowRight" && galleryOpen) navImg(1);
      if (e.key === "ArrowLeft" && galleryOpen) navImg(-1);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [galleryOpen, goBack, navImg, useWebGL]);

  /* preload adjacent artwork images for instant navigation */
  useEffect(() => {
    if (!galleryOpen) return;
    const preloadIdx = [activeIdx - 1, activeIdx + 1];
    for (const idx of preloadIdx) {
      if (idx >= 0 && idx < artworks.length) {
        const art = artworks[idx];
        if (art?.image) {
          const img = new Image();
          img.src = art.image;
        }
      }
    }
  }, [galleryOpen, activeIdx, artworks]);

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      touchXRef.current = e.touches[0].clientX;
    };
    const onEnd = (e: TouchEvent) => {
      if (!galleryOpen) return;
      const dx = e.changedTouches[0].clientX - touchXRef.current;
      if (Math.abs(dx) > 40) navImg(dx < 0 ? 1 : -1);
    };
    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
    };
  }, [galleryOpen, navImg]);

  return (
    <>
      <style>{GALLERY_CSS}</style>
      <div className="gallery-viewport">
        <div className="gallery-nav-wrap" data-gallery>
          <Nav />
        </div>
        <div id="gallery-root">
          <div className="gallery-content">
            <div id="l1" className={galleryOpen ? "out" : ""}>
              <div className="strip-row">
                {CATEGORIES.map((cat, i) => (
                  <div key={cat.id} className="sahaj-panel-wrap">
                    <div
                      className="strip"
                      data-category={cat.id}
                      style={{
                        background: `linear-gradient(rgba(65,49,82,0.35),rgba(65,49,82,0.35)),url(${new URL(`../assets/${cat.img}-medium.webp`, import.meta.url).href}) center/cover no-repeat`,
                      }}
                      onClick={() => openGallery(cat.id)}
                    >
                      <span className="strip-num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="strip-letter">{cat.letter}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <section className="essentials-section">
              <div className="essentials-grid">
                {ESSENTIALS_ENTRIES.map((entry, i) => (
                  <div
                    key={entry.key}
                    className={`essentials-box-wrap ${essentialsReady ? "in" : ""}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div
                      className="essentials-box"
                      onClick={() => openEssentials(entry.key)}
                    >
                      <span>{entry.letter}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <button
              onClick={() => setCatalogueOpen(true)}
              className="btn-catalogue inline-flex items-center gap-3 border border-[var(--gold)] px-8 py-3 text-[11px] tracking-[0.3em] uppercase text-[var(--gold)] transition-all duration-500 hover:bg-[var(--gold)] hover:text-background cursor-pointer"
              style={{ marginTop: 23 }}
            >
              View Our Full Catalogue
              <span className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>

          <footer className="gallery-footer border-t border-border/30 px-8 py-4 md:px-14">
            <div className="flex items-center justify-between">
              <p className="font-display text-xl tracking-[0.3em] text-left">
                SAHAJ GALLERY
              </p>
              <img
                src={ndhLogo}
                alt="NDH House"
                className="h-12 w-auto opacity-80"
              />
            </div>
          </footer>

          <div
            id="l3"
            className={galleryOpen ? "in" : ""}
            style={{ background: "var(--color-background)" }}
          >
            {galleryOpen &&
              (useWebGL ? (
                <WebGLGallery
                  key={c}
                  artworks={artworks}
                  imgIdx={activeIdx}
                  onNavImg={navImg}
                  onSetImgIdx={setActiveIdx}
                  onClose={goBack}
                />
              ) : (
                <>
                  <div id="g-stage" key={c}>
                    {(() => {
                      const idxs: number[] = [];
                      for (let i = activeIdx - 1; i <= activeIdx + 1; i++) {
                        if (i >= 0 && i < artworks.length) idxs.push(i);
                      }
                      return idxs.map((i) => {
                        const art = artworks[i];
                        return (
                          <div
                            key={i}
                            className={`artwork ${i === activeIdx ? "active" : ""}`}
                          >
                            <div className="art-frame">
                              {art.image ? (
                                <img src={art.image} alt="" className="art-img" />
                              ) : art.svg ? (
                                <div
                                  className="art-canvas"
                                  dangerouslySetInnerHTML={{ __html: art.svg }}
                                />
                              ) : art.placeholder ? (
                                <div
                                  className="art-placeholder"
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "100%",
                                    height: "100%",
                                    gap: "12px",
                                    background: `radial-gradient(ellipse at center, ${art.glow}20 0%, transparent 80%)`,
                                    border: `1px solid ${art.glow}15`,
                                    borderRadius: "2px",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontFamily: "Gambetta,Georgia,serif",
                                      fontSize: "clamp(22px,4vw,38px)",
                                      letterSpacing: "0.4em",
                                      opacity: 0.5,
                                      color: art.glow,
                                      userSelect: "none",
                                    }}
                                  >
                                    Coming Soon
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "12px",
                                      letterSpacing: "0.25em",
                                      opacity: 0.25,
                                      textTransform: "uppercase",
                                      color: art.glow,
                                      userSelect: "none",
                                    }}
                                  >
                                    {art.sub}
                                  </span>
                                </div>
                              ) : (
                                <div className="art-canvas" />
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  <button
                    className={`g-arr ${isFirst ? "dim" : ""}`}
                    id="ga-p"
                    onClick={() => navImg(-1)}
                  >
                    <svg
                      viewBox="0 0 22 22"
                      fill="none"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="14,4 7,11 14,18" />
                    </svg>
                  </button>
                  <button
                    className={`g-arr ${isLast ? "dim" : ""}`}
                    id="ga-n"
                    onClick={() => navImg(1)}
                  >
                    <svg
                      viewBox="0 0 22 22"
                      fill="none"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="8,4 15,11 8,18" />
                    </svg>
                  </button>
                </>
              ))}
            {galleryOpen && (
              <>
                <div className="l3-counter">
                  {String(activeIdx + 1).padStart(2, "0")} /{" "}
                  {String(artworks.length).padStart(2, "0")}
                </div>
                <div className="l3-toggle-wrap">
                  <button
                    className="l3-toggle"
                    onClick={() => setUseWebGL((v) => !v)}
                  >
                    {useWebGL ? "Static" : "WebGL"} View
                  </button>
                </div>
                <div className="gallery-close-wrap">
                  <button className="btn-close" onClick={goBack}>
                    <svg
                      viewBox="0 0 14 14"
                      fill="none"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    >
                      <line x1="1" y1="1" x2="13" y2="13" />
                      <line x1="13" y1="1" x2="1" y2="13" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {catalogueOpen && (
        <CataloguePopup
          open={catalogueOpen}
          onOpenChange={setCatalogueOpen}
        />
      )}
    </>
  );
}

export default Work;
