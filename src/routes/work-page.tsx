import { useState, useEffect, useRef, useCallback, lazy } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import GalleryLoadingBar from "@/components/GalleryLoadingBar";
import { useImagePreloader } from "@/hooks/useImagePreloader";

import { r2 } from "@/config/R2_URL";

const INTRO_VIDEO_LANDSCAPE = "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/Video/Video%20Project%2019.mp4";
const INTRO_VIDEO_PORTRAIT = "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Home%20Page/Video/potrait%20user.mp4";
const BG_AUDIO_URL = "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/Video/ReelAudio-80306.mp3";

declare global {
  interface Window {
    __sahaj_gallery_bg_audio?: HTMLAudioElement;
  }
}

let galleryAudioSingleton: HTMLAudioElement | null = null;
let galleryAudioPlaybackStarted = false;
let galleryAudioListenerBound = false;
let galleryIntroPlayAttempted = false;
let galleryIntroVideoListenersBound = false;

function ensureGalleryAudio(): HTMLAudioElement {
  if (galleryAudioSingleton) return galleryAudioSingleton;

  const audio = new Audio(BG_AUDIO_URL);
  audio.preload = "auto";
  audio.loop = false;
  audio.volume = 1.0;
  galleryAudioSingleton = audio;

  if (typeof window !== "undefined") {
    window.__sahaj_gallery_bg_audio = audio;
  }

  return audio;
}

import { CATEGORY_TO_SLUG } from "@/config/artPages";
import {
  ndhLogo4K as ndhLogo,
  stripS,
  stripA,
  stripH,
  stripA1,
  stripJ,
} from "@/assets/assets";

const WebGLGallery = lazy(() => import("@/components/WebGLGallery"));
const CataloguePopup = lazy(() => import("@/components/CataloguePopup"));

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

// S  Eyes - images from sahaj panel/1S
const S_IMG = Array.from({ length: 10 }, (_, i) =>
  r2.sahajPanel(`1S/S${i + 1}.webp`),
);
const EYE_ART: EyeArtwork[] = S_IMG.map((img, i) => ({
  title: `Eyes Study ${i + 1}`,
  sub: `E Y E S  ${String(i + 1).padStart(2, "0")}`,
  desc: "artwork",
  dim: " ",
  glow: "#b87c4a",
  image: img,
}));

// A  Shreenathji - images from sahaj panel/2A
const SHRG_IMGS = [
  r2.sahajPanel("2A/1A.webp"),
  r2.sahajPanel("2A/2A.webp"),
  r2.sahajPanel("2A/3A.webp"),
  r2.sahajPanel("2A/4A.webp"),
  r2.sahajPanel("2A/5A.webp"),
  r2.sahajPanel("2A/6A.webp"),
  r2.sahajPanel("2A/7A.webp"),
];
const THE_SHREENATHJI_GRACE_ART: EyeArtwork[] = [
  ...SHRG_IMGS.map((img, i) => ({
    title: `Shreenathji ${i + 1}`,
    sub: `S H R E E N A T H J I  ${String(i + 1).padStart(2, "0")}`,
    desc: "artwork",
    dim: " ",
    glow: "#c9a96e",
    image: img,
  })),
  ...mkPlaceholders(3, "Shreenathji", "S H R E E N A T H J I", "#c9a96e", 8),
];

// H  Shikshapatri - images from sahaj panel/3H
const THE_SIKSHAPATRI_ART: EyeArtwork[] = Array.from(
  { length: 12 },
  (_, i) => ({
    title: `Shikshapatri Study ${i + 1}`,
    sub: `S H I K S H A P A T R I  ${String(i + 1).padStart(2, "0")}`,
    desc: "artwork",
    dim: " ",
    glow: "#8a6020",
    image: r2.sahajPanel(`3H/${i + 1}H.webp`),
  }),
);

// A (index 3)  Reflection - 9 images from sahaj panel/4A + 1 placeholder
const REF_IMGS = Array.from({ length: 9 }, (_, i) =>
  r2.sahajPanel(`4A/${i + 1}AA.webp`),
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

// J  Cherry Blossom - Coming Soon
const COMING_SOON_JPG = "https://img.magnific.com/free-vector/torn-style-coming-soon-promo-template-social-media-post_1017-55783.jpg?semt=ais_hybrid&w=740&q=80";
const CHERRY_BLOSSOM_ART: EyeArtwork[] = Array.from({ length: 10 }, (_, i) => ({
  title: `Cherry Blossom ${i + 1}`,
  sub: `C H E R R Y  B L O S S O M  ${String(i + 1).padStart(2, "0")}`,
  desc: "coming soon",
  dim: " ",
  glow: "#d08080",
  image: COMING_SOON_JPG,
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
    id: "shikshapatri",
    label: "The Shikshapatri",
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

const INTRO_TEXTS: Record<string, string> = {
  eyes: "A Glimpse of Gallery",
  shreenathji: "Layers Of Craftsmanship",
  shikshapatri: "The Creative Circle",
  reflection: "The Art Of Conversation",
  cherry: "White Glove Installation",
};

/* ─── ESSENTIALS DATA ─── */

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

const ESSENTIALS_GLOW = "#c9a96e";

const ESS_BASE = "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/E%20S%20S%20E%20N%20T%20I%20A%20L%20S/essentials";

const _1E_IMGS = [
  `${ESS_BASE}/1E/11E.webp`,
  `${ESS_BASE}/1E/22E.webp`,
  `${ESS_BASE}/1E/33E.webp`,
];
const ESS_1E_ART: EyeArtwork[] = _1E_IMGS.map((img, i) => ({
  title: `Art ${i + 1}`,
  sub: `E 0 1  ${String(i + 1).padStart(2, "0")}`,
  desc: "artwork",
  dim: " ",
  glow: ESSENTIALS_GLOW,
  image: img,
}));

const _2S_IMGS = [
  `${ESS_BASE}/2S/11SS.webp`,
  `${ESS_BASE}/2S/22SS.webp`,
];
const ESS_2S_ART: EyeArtwork[] = _2S_IMGS.map((img, i) => ({
  title: `Art ${i + 1}`,
  sub: `S 0 2  ${String(i + 1).padStart(2, "0")}`,
  desc: "artwork",
  dim: " ",
  glow: ESSENTIALS_GLOW,
  image: img,
}));

const _3S_IMGS = [
  `${ESS_BASE}/3S/11SSS.webp`,
  `${ESS_BASE}/3S/22SSS.webp`,
  `${ESS_BASE}/3S/33SSS.webp`,
  `${ESS_BASE}/3S/44SSS.webp`,
  `${ESS_BASE}/3S/55SSS.webp`,
];
const ESS_3S_ART: EyeArtwork[] = _3S_IMGS.map((img, i) => ({
  title: `Art ${i + 1}`,
  sub: `S 0 3  ${String(i + 1).padStart(2, "0")}`,
  desc: "artwork",
  dim: " ",
  glow: ESSENTIALS_GLOW,
  image: img,
}));

const _4E_IMGS = [
  `${ESS_BASE}/4E/1.webp`,
  `${ESS_BASE}/4E/2.webp`,
  `${ESS_BASE}/4E/3.webp`,
  `${ESS_BASE}/4E/4.webp`,
];
const ESS_4E_ART: EyeArtwork[] = _4E_IMGS.map((img, i) => ({
  title: `Art ${i + 1}`,
  sub: `E 0 4  ${String(i + 1).padStart(2, "0")}`,
  desc: "artwork",
  dim: " ",
  glow: ESSENTIALS_GLOW,
  image: img,
}));

const _5N_IMGS = [
  `${ESS_BASE}/5N/1N.webp`,
  `${ESS_BASE}/5N/2N.webp`,
];
const ESS_5N_ART: EyeArtwork[] = _5N_IMGS.map((img, i) => ({
  title: `Art ${i + 1}`,
  sub: `N 0 5  ${String(i + 1).padStart(2, "0")}`,
  desc: "artwork",
  dim: " ",
  glow: ESSENTIALS_GLOW,
  image: img,
}));

const _6T_IMGS = [
  `${ESS_BASE}/6T/1SSSS.webp`,
  `${ESS_BASE}/6T/2SSSS.webp`,
  `${ESS_BASE}/6T/3SSSS.webp`,
];
const ESS_6T_ART: EyeArtwork[] = _6T_IMGS.map((img, i) => ({
  title: `Art ${i + 1}`,
  sub: `T 0 6  ${String(i + 1).padStart(2, "0")}`,
  desc: "artwork",
  dim: " ",
  glow: ESSENTIALS_GLOW,
  image: img,
}));
const _7I_IMGS = [
  `${ESS_BASE}/7I/11T.webp`,
  `${ESS_BASE}/7I/22T.webp`,
];
const ESS_7I_ART: EyeArtwork[] = _7I_IMGS.map((img, i) => ({
  title: `Art ${i + 1}`,
  sub: `I 0 7  ${String(i + 1).padStart(2, "0")}`,
  desc: "artwork",
  dim: " ",
  glow: ESSENTIALS_GLOW,
  image: img,
}));
const ESS_8A_ART: EyeArtwork[] = mkPlaceholders(
  5,
  "A",
  "A 0 8",
  ESSENTIALS_GLOW,
  1,
);
const _9L_IMGS = [
  `${ESS_BASE}/8A/11EE.webp`,
  `${ESS_BASE}/8A/22EE.webp`,
  `${ESS_BASE}/8A/33EE.webp`,
  `${ESS_BASE}/8A/44EE.webp`,
  `${ESS_BASE}/8A/55EE.webp`,
];
const ESS_9L_ART: EyeArtwork[] = _9L_IMGS.map((img, i) => ({
  title: `Art ${i + 1}`,
  sub: `L 0 9  ${String(i + 1).padStart(2, "0")}`,
  desc: "artwork",
  dim: " ",
  glow: ESSENTIALS_GLOW,
  image: img,
}));
const _10S_IMGS = [
  `${ESS_BASE}/10S/11SSSS.webp`,
  `${ESS_BASE}/10S/22SSSS.webp`,
  `${ESS_BASE}/10S/33SSSS.webp`,
];
const ESS_10S_ART: EyeArtwork[] = _10S_IMGS.map((img, i) => ({
  title: `Art ${i + 1}`,
  sub: `S 1 0  ${String(i + 1).padStart(2, "0")}`,
  desc: "artwork",
  dim: " ",
  glow: ESSENTIALS_GLOW,
  image: img,
}));

const ESSENTIALS_ENTRIES = [
  { key: "ess_1e", letter: "E", artworks: ESS_1E_ART },
  { key: "ess_2s", letter: "S", artworks: ESS_2S_ART },
  { key: "ess_3s", letter: "S", artworks: ESS_3S_ART },
  { key: "ess_4e", letter: "E", artworks: ESS_4E_ART },
  { key: "ess_5n", letter: "N", artworks: ESS_5N_ART },
  { key: "ess_6t", letter: "T", artworks: ESS_6T_ART },
  { key: "ess_7i", letter: "I", artworks: ESS_7I_ART },
  { key: "ess_8a", letter: "A", artworks: ESS_8A_ART },
  { key: "ess_9l", letter: "L", artworks: ESS_9L_ART },
  { key: "ess_10s", letter: "S", artworks: ESS_10S_ART },
] as const;

/* ─── CSS ─── */
const GALLERY_CSS = `
.gallery-viewport{height:100vh;display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden}
#gallery-root {
  --accent: #c9a96e;
  --accent2: #7a6a8e;
  --bone: #F0EFEB;
  --muted: #b0a4be;
  --ease-cin: cubic-bezier(0.77,0,0.175,1);
  --ease-soft: cubic-bezier(0.4,0,0.2,1);
  --section-spacing: 156px;
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
  padding:calc(var(--section-spacing) + 24px) 20px calc(var(--section-spacing) - 82px);
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
#gallery-root #l1{flex:none;height:480px;display:flex;align-items:center;justify-content:center;transition:opacity .55s var(--ease-soft)}
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
  border-radius:2px;
  box-shadow:0 2px 4px rgba(0,0,0,0.08),0 8px 24px rgba(0,0,0,0.12),0 24px 48px rgba(0,0,0,0.08),0 0 0 1px rgba(201,169,110,0.08);
  will-change:transform;
  transition:transform 0.6s cubic-bezier(.22,1,.36,1),box-shadow 0.6s cubic-bezier(.22,1,.36,1),border-color 0.6s cubic-bezier(.22,1,.36,1),filter 0.6s cubic-bezier(.22,1,.36,1);
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
#gallery-root .panel-wrap{
  height:100%;
  opacity:0;transform:translateY(20px);
  transition:opacity .6s ease-out,transform .6s ease-out;
}
#gallery-root .panel-wrap.in{
  opacity:1;transform:translateY(0);
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
  #gallery-root{--section-spacing:140px}
  #gallery-root .gallery-content{gap:0}
  #gallery-root .essentials-box{width:48px;height:48px}
  #gallery-root .essentials-box span{font-size:16px}
  #gallery-root .essentials-grid{gap:18px}
}
@media screen and (max-width: 768px) and (orientation: portrait){
  .gallery-viewport{overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch}
  #gallery-root{flex:none}
  #gallery-root{--section-spacing:100px}
  #gallery-root .gallery-content{flex:none;min-height:auto;justify-content:flex-start;gap:0}
  #gallery-root #l1{height:auto;padding:0;margin:0;flex:none;width:100%}
  #gallery-root .strip-row{
    flex-direction:row;flex-wrap:nowrap;justify-content:center;
    width:100%;height:56vh;max-height:none;
    padding-inline:12px;padding-block:0;gap:10px;align-items:stretch;
    margin-bottom:32px;
    background:none;
  }
  #gallery-root .sahaj-panel-wrap{height:100%;width:clamp(52px,15.5vw,84px);flex:0 0 auto;display:block;position:relative}
  #gallery-root .panel-wrap{height:100%;width:100%;opacity:0;transform:translateY(16px);transition:opacity .5s ease-out,transform .5s ease-out}
  #gallery-root .panel-wrap.in{opacity:1;transform:translateY(0)}
  #gallery-root .strip{
    width:100%;height:100%;max-height:none;min-height:0;aspect-ratio:auto;
    display:flex;align-items:center;justify-content:center;
    border-radius:20px;position:relative;overflow:hidden;cursor:pointer;
    border:1px solid transparent;
    background-size:cover !important;background-position:center;flex-shrink:0;
    transition:transform .5s cubic-bezier(.22,1,.36,1),filter .5s cubic-bezier(.22,1,.36,1),box-shadow .5s cubic-bezier(.22,1,.36,1),border-color .5s ease;
  }
  #gallery-root .strip::after{content:'';position:absolute;inset:0;border-radius:inherit;background:rgba(23,19,36,.2);z-index:2;pointer-events:none;transition:opacity .5s ease}
  #gallery-root .sahaj-panel-wrap.centered .strip{transform:scale(1.02);box-shadow:0 0 22px rgba(201,169,110,.18)}
  #gallery-root .sahaj-panel-wrap.centered .strip::after{opacity:0}
  #gallery-root .sahaj-panel-wrap:not(.centered) .strip{transform:scale(.98)}
  #gallery-root .sahaj-panel-wrap:not(.centered) .strip::after{opacity:.75}
  #gallery-root .strip:active{transform:scale(0.97)}
  #gallery-root .strip-letter{position:static;transform:none;font-family:'Gambetta',Georgia,serif;font-weight:500;font-size:clamp(48px,16vw,80px);color:transparent;-webkit-text-stroke:1.5px #F0EFEB;line-height:1;user-select:none;z-index:10}
  #gallery-root .strip-num{position:absolute;top:8px;right:10px;font-size:7px;font-weight:200;letter-spacing:.28em;color:rgba(201,169,110,.25);z-index:10}
  #gallery-root .essentials-section{padding:0 0 48px;margin-top:0;text-align:center}
  #gallery-root .essentials-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;max-width:280px;margin:0 auto;justify-items:center;align-items:center}
  #gallery-root .essentials-box-wrap{opacity:0;transform:translateY(16px);transition:opacity .5s ease-out,transform .5s ease-out}
  #gallery-root .essentials-box-wrap.in{opacity:1;transform:translateY(0)}
  #gallery-root .essentials-box{width:44px;height:44px;border:1.2px solid rgba(201,169,110,.75);border-radius:6px;background:transparent;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:border-color .3s ease,transform .3s ease,background .3s ease}
  #gallery-root .essentials-box:active{transform:scale(0.92);background:rgba(201,169,110,.08)}
  #gallery-root .essentials-box span{font-family:'Gambetta',Georgia,serif;font-size:16px;font-weight:500;letter-spacing:.02em;color:var(--bone);user-select:none}
  #gallery-root .gallery-content .btn-catalogue{display:block;margin:0 auto;width:calc(100vw - 48px);max-width:380px;padding:14px 20px;border:1px solid var(--gold);background:transparent;color:var(--gold);font-size:11px;letter-spacing:.3em;text-transform:uppercase;text-align:center;cursor:pointer;transition:background .4s ease,color .4s ease}
  #gallery-root .gallery-content .btn-catalogue:active{background:var(--gold);color:var(--color-background)}
  #gallery-root .gallery-footer{margin-top:0;position:relative;bottom:auto}
  #gallery-root #g-stage{padding:0 20px}
  #gallery-root .artwork{padding:0 20px}
  #gallery-root .art-frame{width:min(85vmin,calc(100vh - 240px))}
}
@keyframes intro-fade{
  0%{opacity:0;transform:scale(.95)}
  15%{opacity:1;transform:scale(1)}
  75%{opacity:1;transform:scale(1)}
  100%{opacity:0;transform:scale(.95)}
}
#gallery-root .intro-overlay{
  position:absolute;inset:0;z-index:50;
  display:flex;align-items:center;justify-content:center;
  background:var(--color-background);
  pointer-events:none;
}
#gallery-root .intro-overlay span{
  font-family:'Gambetta',Georgia,serif;
  font-size:clamp(28px,5vw,48px);
  color:var(--accent);
  letter-spacing:.12em;
  text-align:center;
  padding:0 32px;
  animation:intro-fade 2s ease-in-out forwards;
}

/* ─── 1. Glass Artwork Panel — glass reflection overlay ─── */
#gallery-root .art-frame::before{
  content:'';
  position:absolute;
  inset:0;
  z-index:2;
  pointer-events:none;
  border-radius:inherit;
  background:linear-gradient(
    135deg,
    rgba(255,255,255,0.06) 0%,
    rgba(255,255,255,0.02) 35%,
    transparent 50%,
    rgba(255,255,255,0.01) 75%,
    transparent 100%
  );
  mix-blend-mode:overlay;
}
#gallery-root .art-frame::after{
  content:'';
  position:absolute;
  inset:0;
  z-index:3;
  pointer-events:none;
  border-radius:inherit;
  box-shadow:inset 0 1px 0 rgba(255,255,255,0.04),inset 0 -1px 0 rgba(0,0,0,0.1);
}
#gallery-root .art-frame.glass-hover::before{
  background:linear-gradient(
    105deg,
    transparent 30%,
    rgba(255,255,255,0.06) 45%,
    rgba(255,255,255,0.02) 50%,
    transparent 65%
  );
  transition:background 0.3s ease;
}

/* ─── 2. Floating Gallery Effect ─── */
@keyframes artwork-float{
  0%,100%{transform:translateY(0) translateX(0)}
  20%{transform:translateY(-3px) translateX(1.5px)}
  40%{transform:translateY(-5px) translateX(-1px)}
  60%{transform:translateY(-2px) translateX(2.5px)}
  80%{transform:translateY(-4px) translateX(-1.5px)}
}
#gallery-root .art-frame.float{
  animation:artwork-float var(--float-duration,8s) ease-in-out infinite;
  animation-delay:var(--float-delay,0s);
  will-change:transform;
}

/* ─── 3. Soft Spotlight ─── */
#gallery-root #g-stage::before{
  content:'';
  position:fixed;
  top:50%;left:50%;
  width:min(100vmin,700px);
  height:min(100vmin,700px);
  transform:translate(-50%,-50%);
  background:radial-gradient(circle,rgba(201,169,110,0.04) 0%,rgba(201,169,110,0.01) 40%,transparent 65%);
  pointer-events:none;
  z-index:1;
}

/* ─── 4. Artwork Hover ─── */
#gallery-root .art-frame .art-img{
  max-width:100%;max-height:calc(100vh - 200px);
  width:auto;height:auto;
  object-fit:contain;display:block;
  transition:transform 0.8s cubic-bezier(.22,1,.36,1),filter 0.8s cubic-bezier(.22,1,.36,1);
  will-change:transform;
}
#gallery-root .art-frame:hover .art-img{
  transform:scale(1.09);
  filter:saturate(1.08) contrast(1.06) brightness(1.04);
}
#gallery-root .art-frame:hover{
  box-shadow:
    0 4px 8px rgba(0,0,0,0.08),
    0 16px 32px rgba(0,0,0,0.16),
    0 40px 64px rgba(0,0,0,0.12),
    0 0 0 1px rgba(201,169,110,0.2);
  transform:translateY(-8px);
}

/* ─── 5. Golden Border Shimmer ─── */
@keyframes gold-shimmer{
  0%{left:-10%;opacity:0}
  10%{opacity:1}
  40%{left:100%;opacity:1}
  50%{left:110%;opacity:0}
  100%{left:110%;opacity:0}
}
#gallery-root .art-frame .gold-shimmer{
  position:absolute;
  top:0;left:-10%;
  width:40%;height:100%;
  background:linear-gradient(90deg,transparent 0%,rgba(201,169,110,0.08) 30%,rgba(201,169,110,0.04) 50%,transparent 100%);
  pointer-events:none;
  z-index:4;
  animation:gold-shimmer var(--shimmer-duration,10s) cubic-bezier(.22,1,.36,1) infinite;
  animation-delay:var(--shimmer-delay,0s);
  will-change:transform,opacity;
}

/* ─── 6. Artwork Entrance Animation ─── */
@keyframes artwork-entrance{
  0%{opacity:0;transform:translateY(24px) scale(0.97)}
  100%{opacity:1;transform:translateY(0) scale(1)}
}
#gallery-root .artwork-entrance{
  opacity:0;
  animation:artwork-entrance 0.7s cubic-bezier(.22,1,.36,1) forwards;
  animation-delay:var(--entrance-delay,0s);
}

/* ─── 7. Letter Animation ─── */
@keyframes letter-entrance{
  0%{opacity:0;transform:translateY(16px)}
  100%{opacity:1;transform:translateY(0)}
}
#gallery-root .letter-entrance{
  opacity:0;
  animation:letter-entrance 0.6s cubic-bezier(.22,1,.36,1) forwards;
  animation-delay:var(--letter-delay,0s);
}

/* ─── 8. Active Artwork Focus ─── */
#gallery-root .art-frame.dim-sibling{
  filter:brightness(0.92);
  transition:filter 0.5s cubic-bezier(.22,1,.36,1),transform 0.5s cubic-bezier(.22,1,.36,1);
  transform:scale(0.98);
}
#gallery-root .art-frame.focus-active{
  filter:brightness(1.06);
  transition:filter 0.5s cubic-bezier(.22,1,.36,1),transform 0.5s cubic-bezier(.22,1,.36,1),box-shadow 0.5s cubic-bezier(.22,1,.36,1);
  transform:translateY(-12px);
  box-shadow:
    0 4px 12px rgba(0,0,0,0.1),
    0 20px 40px rgba(0,0,0,0.18),
    0 48px 80px rgba(0,0,0,0.14),
    0 0 0 1px rgba(201,169,110,0.25);
}
`;

/* ─── COMPONENT ─── */
function Work() {
  const navigate = useNavigate();
  const { c, e } = useSearch({ from: "/work" });

  const [activeIdx, setActiveIdx] = useState(0);
  const [useWebGL, setUseWebGL] = useState(false);
  const [essentialsReady, setEssentialsReady] = useState(false);
  const [panelsAnimated, setPanelsAnimated] = useState(false);
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [introText, setIntroText] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState<boolean>(() => !galleryIntroPlayAttempted);
  // Fade state: "in" = video visible, "out" = fading out, false = hidden
  const [introVisible, setIntroVisible] = useState<boolean>(true);
  const [lightboxReady, setLightboxReady] = useState(false);
  const [bgReady, setBgReady] = useState(false);
  const [introSrc] = useState(() =>
    window.matchMedia("(orientation: portrait)").matches ? INTRO_VIDEO_PORTRAIT : INTRO_VIDEO_LANDSCAPE,
  );
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [spotlightVisible, setSpotlightVisible] = useState(false);
  const [entranceDone, setEntranceDone] = useState(false);
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const [entranceArtworks, setEntranceArtworks] = useState(false);
  const [floatingActive, setFloatingActive] = useState(false);
  const [activeStripIdx, setActiveStripIdx] = useState(0);

  // SAHAJ transition overlay refs
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayWordmarkRef = useRef<HTMLDivElement>(null);
  const essentialsOverlayRef = useRef<HTMLDivElement>(null);
  const animTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stripRowRef = useRef<HTMLDivElement>(null);

  const floatDelaysRef = useRef<number[]>([]);
  const floatDurationsRef = useRef<number[]>([]);
  const shimmerDelaysRef = useRef<number[]>([]);
  const shimmerDurationsRef = useRef<number[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeFrameRef = useRef<number | null>(null);
  const introFinishedRef = useRef(false);
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
    if (!introText) return;
    const t = setTimeout(() => setIntroText(null), 2000);
    return () => clearTimeout(t);
  }, [introText]);

  useEffect(() => {
    if (!galleryOpen) setIntroText(null);
  }, [galleryOpen]);

  // ── Toggle: false = old center-wordmark animation ──
  const SAHAJ_ANIM_FROM_PANEL = true;

  // ── SAHAJ transition: letters rise from panel strips and merge into header ──
  const startSahajTransition = useCallback((slug: string, _slugIdx: number) => {
    animTimersRef.current.forEach(clearTimeout);
    animTimersRef.current = [];

    const overlay = overlayRef.current;
    const wordmark = overlayWordmarkRef.current;
    if (!overlay || !wordmark) {
      navigate({
        to: "/art-viewer",
        search: { slug: slug as "s" | "a" | "h" | "a-2" | "j" },
        replace: true,
        state: { sahajTransition: true },
      });
      return;
    }

    // ── Target position — ArtNav top padding (md:py-6 = 24px) ──
    const HEADER_TOP = 24;
    const LETTER_GAP = 40;
    const HEADER_FONT = 20;

    // ── Shared: Show overlay & hide UI ──
    overlay.style.visibility = "visible";
    overlay.style.opacity = "1";

    const navWrap = document.querySelector<HTMLElement>(".gallery-nav-wrap");
    if (navWrap) {
      navWrap.style.transition = "opacity 0.15s ease";
      navWrap.style.opacity = "0";
      navWrap.style.pointerEvents = "none";
    }
    const footer = document.querySelector<HTMLElement>(".gallery-footer");
    if (footer) {
      footer.style.transition = "opacity 0.15s ease";
      footer.style.opacity = "0";
      footer.style.pointerEvents = "none";
    }
    const stripRow = document.getElementById("l1");
    if (stripRow) {
      stripRow.style.transition = "opacity 0.2s ease";
      stripRow.style.opacity = "0";
    }
    document.querySelector(".essentials-section")?.setAttribute(
      "style", "opacity:0;pointer-events:none;transition:opacity 0.2s ease"
    );
    const catBtn = document.querySelector<HTMLElement>(".btn-catalogue");
    if (catBtn) {
      catBtn.style.transition = "opacity 0.2s ease";
      catBtn.style.opacity = "0";
      catBtn.style.pointerEvents = "none";
    }

    // ═══════════════════════════════════════════════════════════════
    // Set SAHAJ_ANIM_FROM_PANEL to false to revert to the old
    // center-wordmark animation. Toggle at line ~936 in this file.
    // ═══════════════════════════════════════════════════════════════

    if (SAHAJ_ANIM_FROM_PANEL) {
      // ── NEW: Letters rise from each panel's strip-letter ──

      const stripLetters = document.querySelectorAll<HTMLElement>(".strip-letter");
      const letterEls = wordmark.querySelectorAll<HTMLElement>(".sahaj-letter");

      // Position each overlay letter at its panel letter's position & size
      letterEls.forEach((el, i) => {
        const panelLetter = stripLetters[i];
        if (!panelLetter) return;
        const rect = panelLetter.getBoundingClientRect();
        const style = getComputedStyle(panelLetter);
        el.style.transition = "none";
        el.style.top = `${rect.top}px`;
        el.style.left = `${rect.left}px`;
        el.style.fontSize = style.fontSize;
        el.style.transform = "none";
        el.style.opacity = "0";
      });

      // Force layout flush
      void wordmark.offsetHeight;

      // Fade letters in at their panel positions
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          letterEls.forEach((el) => {
            el.style.transition = "opacity 0.35s ease";
            el.style.opacity = "1";
          });
        });
      });

      // Animate letters upward to header, shrinking to final size
      animTimersRef.current.push(setTimeout(() => {
        const totalWidth = 4 * LETTER_GAP;
        const startX = (window.innerWidth - totalWidth) / 2;

        letterEls.forEach((el, i) => {
          el.style.transition =
            "top 0.85s cubic-bezier(0.22,1,0.36,1), " +
            "left 0.85s cubic-bezier(0.22,1,0.36,1), " +
            "font-size 0.85s cubic-bezier(0.22,1,0.36,1), " +
            "color 0.85s cubic-bezier(0.22,1,0.36,1), " +
            "-webkit-text-stroke 0.85s cubic-bezier(0.22,1,0.36,1), " +
            "opacity 0.25s ease 0.55s";
          el.style.top = `${HEADER_TOP}px`;
          el.style.left = `${startX + i * LETTER_GAP}px`;
          el.style.fontSize = `${HEADER_FONT}px`;
          el.style.color = "#C8A86E";
          el.style.WebkitTextStroke = "0px transparent";
        });
      }, 450));

      // Fade overlay background away
      animTimersRef.current.push(setTimeout(() => {
        overlay.style.transition = "background 0.4s ease";
        overlay.style.background = "transparent";
      }, 950));

      // Fade letters out
      animTimersRef.current.push(setTimeout(() => {
        letterEls.forEach((el) => {
          el.style.opacity = "0";
        });
      }, 1150));

      // Navigate
      animTimersRef.current.push(setTimeout(() => {
        overlay.style.visibility = "hidden";
        overlay.style.opacity = "0";
        navigate({
          to: "/art-viewer",
          search: { slug: slug as "s" | "a" | "h" | "a-2" | "j" },
          replace: true,
          state: { sahajTransition: true },
        });
      }, 1300));

    } else {
      // ── OLD: Wordmark at screen center, flies straight up ──

      // Hide the fixed-position children so they don't interfere
      wordmark.querySelectorAll<HTMLElement>(".sahaj-letter").forEach((el) => {
        el.style.display = "none";
      });

      // Create a temporary centered wordmark inside overlay
      const temp = document.createElement("div");
      temp.id = "sahaj-old-wordmark";
      temp.style.cssText =
        "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);" +
        "display:flex;align-items:center;gap:40px;opacity:0;z-index:102;" +
        "font-family:'Gambetta',Georgia,serif;font-size:28px;font-weight:500;" +
        "line-height:1;letter-spacing:0.32em;text-transform:uppercase;color:#C8A86E;" +
        "user-select:none;transition:none;";
      temp.innerHTML = "S A H A J";
      overlay.appendChild(temp);

      void temp.offsetHeight;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          temp.style.transition = "opacity 0.35s ease";
          temp.style.opacity = "1";
        });
      });

      animTimersRef.current.push(setTimeout(() => {
        temp.style.transition =
          "top 0.85s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease 0.55s";
        temp.style.top = `${HEADER_TOP}px`;
        temp.style.transform = "translateX(-50%)";
      }, 450));

      animTimersRef.current.push(setTimeout(() => {
        overlay.style.transition = "background 0.4s ease";
        overlay.style.background = "transparent";
      }, 950));

      animTimersRef.current.push(setTimeout(() => {
        temp.style.opacity = "0";
      }, 1150));

      animTimersRef.current.push(setTimeout(() => {
        temp.remove();
        overlay.style.visibility = "hidden";
        overlay.style.opacity = "0";
        navigate({
          to: "/art-viewer",
          search: { slug: slug as "s" | "a" | "h" | "a-2" | "j" },
          replace: true,
          state: { sahajTransition: true },
        });
      }, 1300));
    }
  }, [navigate]);

  // ── ESSENTIALS transition: simply fade section and navigate ──
  const startEssentialsTransition = useCallback(() => {
    const essSection = document.querySelector<HTMLElement>(".essentials-section");
    if (essSection) {
      essSection.style.transition = "opacity 0.2s ease";
      essSection.style.opacity = "0";
      essSection.style.pointerEvents = "none";
    }
  }, []);

  // ── Background audio: create once and reuse for the current page visit ──
  useEffect(() => {
    const audio = ensureGalleryAudio();
    bgAudioRef.current = audio;

    const cleanupResumeListeners = () => {
      document.removeEventListener("click", resumeAudio);
      document.removeEventListener("touchstart", resumeAudio);
      document.removeEventListener("keydown", resumeAudio);
    };

    const resumeAudio = () => {
      void audio.play().catch(() => { });
      cleanupResumeListeners();
    };

    const handleAudioEnded = () => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0;
    };

    if (!galleryAudioListenerBound) {
      audio.addEventListener("ended", handleAudioEnded);
      galleryAudioListenerBound = true;
    }

    if (galleryAudioPlaybackStarted) return;

    galleryAudioPlaybackStarted = true;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        cleanupResumeListeners();
        document.addEventListener("click", resumeAudio, { once: true });
        document.addEventListener("touchstart", resumeAudio, { once: true });
        document.addEventListener("keydown", resumeAudio, { once: true });
      });
    }

    return () => {
      cleanupResumeListeners();
      if (fadeFrameRef.current !== null) {
        cancelAnimationFrame(fadeFrameRef.current);
        fadeFrameRef.current = null;
      }
      if (bgAudioRef.current === audio) {
        bgAudioRef.current = null;
      }

      if (typeof window !== "undefined" && window.location.pathname !== "/work") {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0;
      }
    };
  }, []);

  // ── Preload background assets before intro becomes visible ──
  useEffect(() => {
    let cancelled = false;

    // Preload strip background images
    [stripS, stripA, stripH, stripA1, stripJ].forEach((url) => {
      const img = new Image();
      img.src = url;
    });

    // Preload art-viewer page chunk so navigation is instant on click
    import("./art-viewer-page").catch(() => { });

    // Wait for video to be playable before showing intro overlay
    const video = videoRef.current;
    if (video) {
      const onReady = () => {
        if (!cancelled) setBgReady(true);
      };
      if (video.readyState >= 2) {
        onReady();
      } else {
        video.addEventListener("loadeddata", onReady, { once: true });
        const timer = setTimeout(onReady, 5000);
        return () => {
          cancelled = true;
          clearTimeout(timer);
        };
      }
    } else {
      setBgReady(true);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // ── Volume fade helper: gradually reduce from current to 0.20 over ~500ms ──
  const fadeAudioToAmbient = useCallback(() => {
    const audio = bgAudioRef.current;
    if (!audio) return;

    if (fadeFrameRef.current !== null) {
      cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
    }

    const targetVol = 0.20;
    const durationMs = 500;
    const startVol = audio.volume;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const nextVol = startVol + (targetVol - startVol) * progress;
      audio.volume = Math.max(targetVol, Math.min(1, nextVol));

      if (progress < 1) {
        fadeFrameRef.current = requestAnimationFrame(tick);
      } else {
        audio.volume = targetVol;
        fadeFrameRef.current = null;
      }
    };

    fadeFrameRef.current = requestAnimationFrame(tick);
  }, []);

  // ── Transition from intro → gallery (natural or skip) ──
  const finishIntro = useCallback(() => {
    if (introFinishedRef.current) return;
    introFinishedRef.current = true;

    fadeAudioToAmbient();
    // Fade the intro overlay out, then unmount
    setIntroVisible(false);
    const t = setTimeout(() => {
      setShowIntro(false);
      setPanelsAnimated(true);
      setEssentialsReady(true);
    }, 550); // matches CSS transition duration
    return () => clearTimeout(t);
  }, [fadeAudioToAmbient]);

  const handleIntroEnd = useCallback(() => {
    finishIntro();
  }, [finishIntro]);

  const handleSkip = useCallback(() => {
    if (videoRef.current) videoRef.current.pause();
    // Stop background audio completely — user chose to skip
    const audio = bgAudioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 0;
    }
    finishIntro();
  }, [finishIntro]);

  // ── Lightbox image preloader ──
  const artworkImages = galleryOpen
    ? artworks.filter((a) => a.image).map((a) => a.image as string)
    : [];
  const { progress, isLoaded } = useImagePreloader(artworkImages);

  useEffect(() => {
    if (!galleryOpen) {
      setLightboxReady(false);
    }
  }, [galleryOpen]);

  useEffect(() => {
    if (isLoaded && galleryOpen) {
      const t = setTimeout(() => setLightboxReady(true), 100);
      return () => clearTimeout(t);
    }
  }, [isLoaded, galleryOpen]);

  const touchXRef = useRef(0);

  const SLUGS = ["s", "a", "h", "a-2", "j"];

  const openGallery = useCallback(
    (categoryId: CategoryId) => {
      const slug = CATEGORY_TO_SLUG[categoryId] as "s" | "a" | "h" | "a-2" | "j" | undefined;
      if (!slug) return;
      const slugIdx = SLUGS.indexOf(slug);
      startSahajTransition(slug, slugIdx);
    },
    [startSahajTransition],
  );

  const openEssentials = useCallback(
    (key: EssentialsKey) => {
      startEssentialsTransition();
      const tid = setTimeout(() => {
        navigate({ to: "/essentials-viewer", search: { e: key }, replace: true });
      }, 300);
      animTimersRef.current.push(tid);
    },
    [navigate, startEssentialsTransition],
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
    if (showIntro) return;
    const t = setTimeout(() => {
      setPanelsAnimated(true);
      setEssentialsReady(true);
    }, 50);
    return () => clearTimeout(t);
  }, [showIntro]);

  useEffect(() => {
    if (!showIntro || galleryIntroPlayAttempted || !videoRef.current) return;

    const video = videoRef.current;
    galleryIntroPlayAttempted = true;

    if (!galleryIntroVideoListenersBound) {
      const handleVideoEnded = () => {
        if (!introFinishedRef.current) {
          finishIntro();
        }
      };
      const handleVideoError = () => {
        if (!introFinishedRef.current) {
          finishIntro();
        }
      };

      video.addEventListener("ended", handleVideoEnded);
      video.addEventListener("error", handleVideoError);
      galleryIntroVideoListenersBound = true;
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => { });
    }
  }, [showIntro, finishIntro]);

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

  // ── Mobile portrait: track which strip is centered in the snap row ──
  useEffect(() => {
    const row = stripRowRef.current;
    if (!row) return;
    const update = () => {
      const panels = Array.from(
        row.querySelectorAll<HTMLElement>(".sahaj-panel-wrap"),
      );
      if (!panels.length) return;
      const target = row.scrollLeft + row.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      panels.forEach((el, i) => {
        const left =
          el.getBoundingClientRect().left - row.getBoundingClientRect().left;
        const center = left + el.offsetWidth / 2;
        const dist = Math.abs(center - target);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActiveStripIdx(best);
    };
    update();
    row.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      row.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // ── Random float & shimmer delays ──
  useEffect(() => {
    if (!galleryOpen) return;
    const count = artworks.length;
    floatDelaysRef.current = Array.from({ length: count }, () => Math.random() * 5);
    floatDurationsRef.current = Array.from({ length: count }, () => 4 + Math.random() * 4);
    shimmerDelaysRef.current = Array.from({ length: count }, () => Math.random() * 12);
    shimmerDurationsRef.current = Array.from({ length: count }, () => 8 + Math.random() * 4);
    const enterTimer = setTimeout(() => {
      setEntranceArtworks(true);
      setEntranceDone(true);
    }, 100);
    const floatTimer = setTimeout(() => {
      setFloatingActive(true);
    }, 1500);
    return () => { clearTimeout(enterTimer); clearTimeout(floatTimer); setEntranceArtworks(false); setEntranceDone(false); setFloatingActive(false); };
  }, [galleryOpen, c, e]);

  // ── Mouse spotlight ──
  const handleMouseMoveSpotlight = useCallback((e: React.MouseEvent) => {
    setSpotlightPos({ x: e.clientX, y: e.clientY });
    setSpotlightVisible(true);
  }, []);
  const handleMouseLeaveSpotlight = useCallback(() => {
    setSpotlightVisible(false);
  }, []);

  // ── Active artwork focus ──
  const handleArtworkEnter = useCallback((idx: number) => {
    setFocusIdx(idx);
  }, []);
  const handleArtworkLeave = useCallback(() => {
    setFocusIdx(null);
  }, []);

  return (
    <>
      <style>{GALLERY_CSS}</style>

      {/* ── Intro video overlay (session-guarded) ── */}
      {showIntro && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            backgroundColor: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: introVisible ? 1 : 0,
            transition: "opacity 0.55s ease",
            pointerEvents: introVisible ? "all" : "none",
          }}
        >
          <video
            ref={videoRef}
            src={introSrc}
            playsInline
            muted
            autoPlay
            preload="auto"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Skip button — glassmorphism pill */}
          <button
            onClick={handleSkip}
            style={{
              position: "absolute",
              bottom: "12px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(18px) saturate(180%)",
              WebkitBackdropFilter: "blur(18px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "999px",
              padding: "12px 32px",
              color: "rgba(255,255,255,0.90)",
              fontSize: "12px",
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 0.3s ease, border-color 0.3s ease, color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
              boxShadow: "0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
              userSelect: "none",
              outline: "none",
              zIndex: 110,
            }}
            onMouseEnter={e => {
              const btn = e.currentTarget;
              btn.style.background = "rgba(255,255,255,0.16)";
              btn.style.borderColor = "rgba(255,255,255,0.35)";
              btn.style.color = "rgba(255,255,255,1)";
              btn.style.boxShadow = "0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.2)";
              btn.style.transform = "translateX(-50%) translateY(-2px)";
            }}
            onMouseLeave={e => {
              const btn = e.currentTarget;
              btn.style.background = "rgba(255,255,255,0.08)";
              btn.style.borderColor = "rgba(255,255,255,0.18)";
              btn.style.color = "rgba(255,255,255,0.90)";
              btn.style.boxShadow = "0 4px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)";
              btn.style.transform = "translateX(-50%) translateY(0)";
            }}
          >
            Skip Video
          </button>
        </div>
      )}

      <div className="gallery-viewport" style={{ opacity: 1 }}>
        <div className="gallery-nav-wrap" data-gallery>
          {!showIntro && <Nav />}
        </div>
        <div id="gallery-root" onMouseMove={handleMouseMoveSpotlight} onMouseLeave={handleMouseLeaveSpotlight}>
          <div
            className={`mouse-spotlight ${spotlightVisible ? "visible" : ""}`}
            style={{
              left: `${spotlightPos.x}px`,
              top: `${spotlightPos.y}px`,
            }}
          />
          <div className="gallery-content">
            <div className="w-full">
              <div id="l1" className={`${galleryOpen ? "out" : ""}`}>
                <div className="strip-row" ref={stripRowRef}>
                   {CATEGORIES.map((cat, i) => {
                    return (
                      <div key={cat.id} className={`sahaj-panel-wrap ${i === activeStripIdx ? "centered" : ""}`}>
                        <div className={`panel-wrap ${panelsAnimated ? "in" : ""}`} style={{ transitionDelay: `${i * 100}ms` }}>
                          <div
                            className="strip"
                            data-category={cat.id}
                            style={{
                              background: `linear-gradient(rgba(65,49,82,0.35),rgba(65,49,82,0.35)),url(${({
                                S: stripS,
                                A: stripA,
                                H: stripH,
                                A1: stripA1,
                                J: stripJ,
                              } as Record<string, string>)[cat.img]
                                }) center/cover no-repeat`,
                            }}
                            onClick={() => openGallery(cat.id)}
                          >
                            <span className="strip-num">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span
                              className="strip-letter"
                            >{cat.letter}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <section className="essentials-section">
                <div className="essentials-grid">
                  {ESSENTIALS_ENTRIES.map((entry, i) => (
                    <div
                      key={entry.key}
                      className={`essentials-box-wrap ${essentialsReady ? "in letter-entrance" : ""}`}
                      style={{
                        ["--letter-delay" as string]: `${i * 90}ms`,
                        transitionDelay: `${i * 100}ms`,
                      } as React.CSSProperties}
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

              <div className="flex justify-center py-8">
                <button
                  onClick={() => setCatalogueOpen(true)}
                  className="btn-catalogue inline-flex items-center gap-3 border border-[var(--gold)] px-8 py-3 text-[11px] tracking-[0.3em] uppercase text-[var(--gold)] transition-all duration-500 hover:bg-[var(--gold)] hover:text-background cursor-pointer"
                >
                  View Our Full Catalogue
                  <span className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>

          {!showIntro && (
            <footer className="gallery-footer border-t border-border/30 px-8 py-4 md:px-14">
              <div className="flex items-center justify-between">
                <p className="font-display text-lg md:text-xl tracking-[0.3em] text-left text-[#C8A86E]">
                  SAHAJ GALLERY
                </p>
                <img
                  src={ndhLogo}
                  alt="NDH House"
                  className="h-12 w-auto opacity-80"
                />
              </div>
            </footer>
          )}

          <GalleryLoadingBar progress={progress} visible={galleryOpen && !lightboxReady} />

          <div
            id="l3"
            className={galleryOpen && lightboxReady ? "in" : ""}
            style={{ background: "var(--color-background)" }}
          >
            {introText && (
              <div className="intro-overlay">
                <span>{introText}</span>
              </div>
            )}
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
                        const floatDur = floatDurationsRef.current[i];
                        const floatDel = floatDelaysRef.current[i];
                        const shimmerDel = shimmerDelaysRef.current[i];
                        const shimmerDur = shimmerDurationsRef.current[i];
                        const isFocused = focusIdx === i;
                        const isDimmed = focusIdx !== null && focusIdx !== i;
                        const entranceDel = i * 90;
                        return (
                          <div
                            key={i}
                            className={`artwork ${i === activeIdx ? "active" : ""}`}
                          >
                            <div
                              className={`art-frame ${entranceArtworks ? "artwork-entrance" : ""} ${floatingActive ? "float" : ""} ${isFocused ? "focus-active" : ""} ${isDimmed ? "dim-sibling" : ""}`}
                              style={{
                                ["--entrance-delay" as string]: `${entranceDel}ms`,
                                ["--float-duration" as string]: floatDur ? `${floatDur}s` : "6s",
                                ["--float-delay" as string]: floatDel ? `${floatDel}s` : "0s",
                                ["--shimmer-duration" as string]: shimmerDur ? `${shimmerDur}s` : "10s",
                                ["--shimmer-delay" as string]: shimmerDel !== undefined ? `${shimmerDel}s` : "0s",
                              }}
                              onMouseEnter={() => handleArtworkEnter(i)}
                              onMouseLeave={handleArtworkLeave}
                            >
                              <div className="gold-shimmer" />
                              {art.image ? (
                                <img src={art.image} alt="" className="art-img" loading="lazy" decoding="async" />
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

      {/* ── SAHAJ transition overlay — letters rise from panels and merge into header ── */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          pointerEvents: "none",
          visibility: "hidden",
          opacity: 0,
          background: "rgb(65,49,82)",
          transition: "none",
        }}
      >
        <div
          ref={overlayWordmarkRef}
          style={{
            position: "fixed",
            inset: 0,
          }}
        >
          {["S", "A", "H", "A", "J"].map((letter, i) => (
            <span
              key={i}
              className="sahaj-letter"
              data-index={i}
              style={{
                position: "fixed",
                fontFamily: "'Gambetta', Georgia, serif",
                fontWeight: 500,
                lineHeight: 1,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "transparent",
                WebkitTextStroke: "2px #F0EFEB",
                userSelect: "none",
                opacity: 0,
                willChange: "top, left, font-size, opacity, color",
                transition: "none",
                zIndex: 101,
                fontSize: "clamp(90px, 10vw, 130px)",
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div
          ref={essentialsOverlayRef}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 102,
            pointerEvents: "none",
          }}
        />
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
