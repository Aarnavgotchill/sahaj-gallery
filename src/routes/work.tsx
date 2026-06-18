import { useState, useEffect, useRef, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import WebGLGallery from "@/components/WebGLGallery";
import ndhLogo from "@/assets/NDH_logo_4K.png";

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

export const Route = createFileRoute("/work")({
  validateSearch: (search: Record<string, string | undefined>): { c?: CategoryId } => {
    const c = resolveCategoryId(search.c ?? search.category);
    return c ? { c } : {};
  },
  head: () => ({
    meta: [
      { title: "Gallery   Sahaj Gallery" },
      {
        name: "description",
        content: "Browse the full collection of works at Sahaj Gallery in Ahmedabad.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Montserrat:wght@200;300;400&display=swap",
      },
    ],
  }),
  component: Work,
});

/* ─── DATA ─── */

interface EyeArtwork {
  title: string;
  sub: string;
  desc: string;
  dim: string;
  glow: string;
  svg?: string;
  image?: string;
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

// S   1 real image + 9 coming-soon placeholders
const EYE_ART: EyeArtwork[] = [
  {
    title: "Iris I  Dawn",
    sub: "I R I S  I",
    desc: "oil on linen \u00b7 2023",
    dim: "120 \u00d7 160 cm",
    glow: "#b87c4a",
    image: new URL(`../assets/iris-elephant.png`, import.meta.url).href,
  },
  ...mkPlaceholders(9, "Iris Study", "I R I S", "#b87c4a", 2),
];

// The Shreenathji Grace - 7 images + 3 blank placeholders
const SHRG_IMGS = Array.from({ length: 7 }, (_, i) =>
  new URL(`../assets/The Shreenathji Grace/${i + 1}.png`, import.meta.url).href
);
const THE_SHREENATHJI_GRACE_ART: EyeArtwork[] = [
  ...SHRG_IMGS.map((img, i) => ({
    title: `Shreenathji ${i + 1}`,
    sub: `S H R E E N A T H J I  ${String(i + 1).padStart(2, "0")}`,
    desc: "archival print · 2024",
    dim: "variable dimensions",
    glow: "#c9a96e",
    image: img,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    title: `Shreenathji ${SHRG_IMGS.length + i + 1}`,
    sub: `S H R E E N A T H J I  ${String(SHRG_IMGS.length + i + 1).padStart(2, "0")}`,
    desc: "coming soon",
    dim: " ",
    glow: "#c9a96e",
    placeholder: true,
  })),
];

// H   10 coming-soon placeholders
const THE_SIKSHAPATRI_ART: EyeArtwork[] = mkPlaceholders(10, "Sikshapatri Study", "S I K S H A P A T R I", "#8a6020");

// A (index 3)   10 coming-soon placeholders
const THE_REFLECTION_ART: EyeArtwork[] = mkPlaceholders(10, "Reflection Series", "R E F L E C T I O N", "#206a8a");

// J   10 coming-soon placeholders
const CHERRY_BLOSSOM_ART: EyeArtwork[] = mkPlaceholders(10, "Cherry Blossom", "C H E R R Y  B L O S S O M", "#d08080");

// Category mapping   explicit IDs link panels to their artwork datasets
const CATEGORIES = [
  { id: "eyes",      label: "The Eyes",              artworks: EYE_ART,                letter: "S",  img: "S"  },
  { id: "shreenathji", label: "The Shreenathji Grace", artworks: THE_SHREENATHJI_GRACE_ART, letter: "A",  img: "A"  },
  { id: "sikshapatri", label: "The Sikshapatri",       artworks: THE_SIKSHAPATRI_ART,    letter: "H",  img: "H"  },
  { id: "reflection", label: "The Reflection",         artworks: THE_REFLECTION_ART,     letter: "A",  img: "A1" },
  { id: "cherry",    label: "Cherry Blossom",         artworks: CHERRY_BLOSSOM_ART,     letter: "J",  img: "J"  },
] as const;

const CATEGORY_ARTWORKS = CATEGORIES.map((c) => c.artworks);

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

/* Centered content wrapper   holds SAHAJ panels + Essentials */
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

/* L1 */
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
  height:100%;width:auto;aspect-ratio:216/504;
  max-height:480px;
  overflow:hidden;
  cursor:pointer;
  border:1.2px solid transparent;
  border-radius:7px;
  transition:width .65s var(--ease-cin), border-color .3s ease, box-shadow .3s ease;
  filter:brightness(.7);
  flex-shrink:0;
}
#gallery-root .strip:hover{width:260px;border-color:rgba(201,169,110,.8);box-shadow:0 0 32px rgba(201,169,110,.12)}
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
  transition:transform .5s cubic-bezier(0.34,1.56,0.64,1), color .4s ease, -webkit-text-stroke-color .4s ease;
  z-index:10;
}
#gallery-root .strip:hover .strip-letter{
  color:rgba(201,169,110,.35);
  -webkit-text-stroke-color:rgba(201,169,110,.9);
  transform:translate(-50%,-50%) scale(1.08);
}
#gallery-root .strip-num{
  position:absolute;top:10px;right:9px;
  font-size:8px;font-weight:200;letter-spacing:.28em;
  color:rgba(201,169,110,.25);z-index:10;
}
#gallery-root .strip::after{
  content:'';position:absolute;bottom:0;left:0;right:0;
  height:2px;background:var(--accent);opacity:0;
  transition:opacity .3s;
}
#gallery-root .strip:hover::after{opacity:.4}

/* Gallery close button */
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

/* L3   Elegant fade + scale entrance */
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
  width:56px;height:56px;
  background:rgba(201,169,110,.04);
  border:1px solid rgba(201,169,110,.12);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;z-index:60;
  transition:background .3s, border-color .3s, opacity .3s;
}
#gallery-root .g-arr:hover{background:rgba(201,169,110,.1);border-color:rgba(201,169,110,.3)}
#gallery-root .g-arr.dim{opacity:.15;pointer-events:none}
#gallery-root .g-arr svg{stroke:var(--accent);width:20px;height:20px}
#gallery-root #ga-p{left:20px}
#gallery-root #ga-n{right:20px}
/* Placeholder */
#gallery-root .art-placeholder{border:1px solid rgba(201,169,110,.08);border-radius:2px}
/* Artwork transitions */
#gallery-root .artwork{transition:opacity .6s ease;opacity:0}
#gallery-root .artwork.active{opacity:1}
@media(max-width:640px){
  #gallery-root #l1{padding:16px 0 8px}
  #gallery-root .strip-row{flex-direction:column;width:100%;padding:0 12px;gap:6px;height:auto}
  #gallery-root .sahaj-panel-wrap{height:auto}
  #gallery-root .strip{width:100%;height:auto;aspect-ratio:auto;max-height:none;min-height:48px}
  #gallery-root .strip:hover{width:100%;filter:brightness(1);transform:none}
  #gallery-root .strip-letter{font-size:28px}
  #gallery-root .strip-num{font-size:7px;top:8px;right:8px}
  #gallery-root #g-stage{padding:0 20px}
  #gallery-root .artwork{padding:0 20px}
  #gallery-root .art-frame{width:min(85vmin,calc(100vh - 240px))}
}
/* Gallery footer   SAHAJ GALLERY branding on front page only */
#gallery-root .gallery-footer{
  transition:opacity .55s var(--ease-soft);
}
#gallery-root .gallery-footer{border-top-color:rgba(90,74,110,0.3)!important}

/* Gallery vignette overlay on L3 */
#gallery-root #l3::before{
  content:'';position:fixed;inset:0;z-index:5;pointer-events:none;
  background:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,0.6) 100%);
}
/* Bloom on L3 */
#gallery-root #l3::after{
  content:'';position:fixed;inset:0;z-index:5;pointer-events:none;
  background:radial-gradient(ellipse 70% 40% at 50% 0%,rgba(201,169,110,0.04) 0%,transparent 70%),
             radial-gradient(ellipse 60% 50% at 50% 100%,rgba(90,60,140,0.03) 0%,transparent 60%);
}

/* SAHAJ panel stagger animation (matching Essentials style) */
#gallery-root .sahaj-panel-wrap{
  opacity:0;transform:translateY(30px);
  transition:opacity 1.2s cubic-bezier(0.34,1.56,0.64,1),transform 1.2s cubic-bezier(0.34,1.56,0.64,1);
  height:100%;flex-shrink:0;
}
#gallery-root .sahaj-panel-wrap.in{
  opacity:1;transform:translateY(0);
}
#gallery-root .strip:hover{
  border-color:rgba(201,169,110,1);
  box-shadow:0 0 24px rgba(201,169,110,.12);
}

/* Hide essentials when gallery opens */
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
  cursor:default;
  transition:border-color .3s ease, transform .3s ease, background .3s ease, box-shadow .3s ease;
}
#gallery-root .essentials-box:hover{
  border-color:rgba(201,169,110,1);
  transform:scale(1.05);
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
/* Mount animation for essentials boxes */
#gallery-root .essentials-box-wrap{
  opacity:0;transform:translateY(20px);
  transition:opacity .6s ease-out,transform .6s ease-out;
}
#gallery-root .essentials-box-wrap.in{
  opacity:1;transform:translateY(0);
}
@media(max-width:768px){
  #gallery-root #l1{height:360px}
  #gallery-root .gallery-content{gap:0;padding:156px 20px 50px}
  #gallery-root .essentials-box{width:48px;height:48px}
  #gallery-root .essentials-box span{font-size:16px}
  #gallery-root .essentials-grid{gap:18px}
}
@media(max-width:480px){
  #gallery-root #l1{height:280px}
  #gallery-root .gallery-content{gap:0;padding:134px 12px 50px}
  #gallery-root .essentials-section{padding:0 16px}
  #gallery-root .essentials-box{width:42px;height:42px}
  #gallery-root .sahaj-panel-wrap{height:auto}
  #gallery-root .essentials-box span{font-size:14px}
  #gallery-root .essentials-grid{gap:14px;max-width:320px;margin:0 auto}
}
`;

/* ─── COMPONENT ─── */
function Work() {
  const navigate = useNavigate();
  const { c } = Route.useSearch();

  const [activeIdx, setActiveIdx] = useState(0);
  const [useWebGL, setUseWebGL] = useState(false);
  const [essentialsReady, setEssentialsReady] = useState(false);

  const galleryOpen = !!c;
  const activeCategory =
    CATEGORIES.find((cat) => cat.id === c) ?? null;
  const artworks = activeCategory?.artworks ?? CATEGORIES[0].artworks;
  const isFirst = activeIdx === 0;
  const isLast = activeIdx === artworks.length - 1;

  useEffect(() => {
    setActiveIdx(0);
  }, [c]);

  useEffect(() => {
    const t = setTimeout(() => setEssentialsReady(true), 50);
    return () => clearTimeout(t);
  }, []);
  const touchXRef = useRef(0);

  const openGallery = useCallback((categoryId: CategoryId) => {
    navigate({ to: "/work", search: { c: categoryId }, replace: true });
  }, [navigate]);

  const navImg = useCallback((dir: 1|-1) => {
    const next = activeIdx + dir;
    if (next < 0 || next >= artworks.length) return;
    setActiveIdx(next);
  }, [activeIdx, artworks.length]);

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

  useEffect(() => {
    const onStart = (e: TouchEvent) => { touchXRef.current = e.touches[0].clientX; };
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

        {/* Centered content: SAHAJ panels + Essentials */}
        <div className="gallery-content">
          {/* L1: Catalogue strips   each panel maps to a category via its explicit ID */}
          <div id="l1" className={galleryOpen ? "out" : ""}>
            <div className="strip-row">
              {CATEGORIES.map((cat, i) => (
                <div
                  key={cat.id}
                  className={`sahaj-panel-wrap ${essentialsReady ? "in" : ""}`}
                  style={{ transitionDelay: `${i * 250}ms` }}
                >
                  <div
                    className="strip"
                    data-category={cat.id}
                    style={{ background: `linear-gradient(rgba(65,49,82,0.35),rgba(65,49,82,0.35)),url(${new URL(`../assets/${cat.img}.webp`, import.meta.url).href}) center/cover no-repeat` }}
                    onClick={() => openGallery(cat.id)}
                  >
                    <span className="strip-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="strip-letter">{cat.letter}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Essentials section */}
          <section className="essentials-section">
            <div className="essentials-grid">
              {["E","S","S","E","N","T","I","A","L","S"].map((letter, i) => (
                <div key={i} className={`essentials-box-wrap ${essentialsReady ? "in" : ""}`} style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="essentials-box">
                    <span>{letter}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* View Full Catalogue button */}
          <a
            href="https://drive.google.com/drive/folders/1tbnA8k-aKQ5vYCD_LJQnZrmr8C4tQddc?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-[var(--gold)] px-8 py-3 text-[11px] tracking-[0.3em] uppercase text-[var(--gold)] transition-all duration-500 hover:bg-[var(--gold)] hover:text-background cursor-pointer"
            style={{ marginTop: 23 }}
          >
            View Our Full Catalogue
            <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
          </a>
        </div>

        <footer className="gallery-footer border-t border-border/30 px-8 py-4 md:px-14">
          <div className="flex items-center justify-between">
            <p className="font-display text-xl tracking-[0.3em] text-left">SAHAJ GALLERY</p>
            <img src={ndhLogo} alt="NDH House" className="h-12 w-auto opacity-80" />
          </div>
        </footer>

        {/* Gallery: Immersive art view */}
        <div
          id="l3"
          className={galleryOpen ? "in" : ""}
          style={{ background: "var(--color-background)" }}
        >
          {galleryOpen && (useWebGL ? (
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
            {artworks.map((art, i) => (
              <div key={i} className={`artwork ${i === activeIdx ? "active" : ""}`}>
                <div className="art-frame">
                  {art.image ? (
                    <img src={art.image} alt="" className="art-img" />
                  ) : art.svg ? (
                    <div className="art-canvas" dangerouslySetInnerHTML={{ __html: art.svg }} />
                  ) : art.placeholder ? (
                    <div className="art-placeholder" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:'100%', height:'100%', gap:'12px', background:`radial-gradient(ellipse at center, ${art.glow}20 0%, transparent 80%)`, border:`1px solid ${art.glow}15`, borderRadius:'2px' }}>
                      <span style={{ fontFamily:'Gambetta,Georgia,serif', fontSize:'clamp(22px,4vw,38px)', letterSpacing:'0.4em', opacity:0.5, color:art.glow, userSelect:'none' }}>Coming Soon</span>
                      <span style={{ fontSize:'12px', letterSpacing:'0.25em', opacity:0.25, textTransform:'uppercase', color:art.glow, userSelect:'none' }}>{art.sub}</span>
                    </div>
                  ) : (
                    <div className="art-canvas" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className={`g-arr ${isFirst ? "dim" : ""}`} id="ga-p" onClick={() => navImg(-1)}>
            <svg viewBox="0 0 22 22" fill="none" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"><polyline points="14,4 7,11 14,18"/></svg>
          </button>
          <button className={`g-arr ${isLast ? "dim" : ""}`} id="ga-n" onClick={() => navImg(1)}>
            <svg viewBox="0 0 22 22" fill="none" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"><polyline points="8,4 15,11 8,18"/></svg>
          </button>
          </>))}
          {galleryOpen && (
          <>
          <div className="l3-counter">
            {String(activeIdx + 1).padStart(2, "0")} / {String(artworks.length).padStart(2, "0")}
          </div>
          <div className="l3-toggle-wrap">
            <button className="l3-toggle" onClick={() => setUseWebGL((v) => !v)}>
              {useWebGL ? "Static" : "WebGL"} View
            </button>
          </div>
          <div className="gallery-close-wrap">
            <button className="btn-close" onClick={goBack}>
              <svg viewBox="0 0 14 14" fill="none" strokeWidth="1.2" strokeLinecap="round">
                <line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/>
              </svg>
            </button>
          </div>
          </>
          )}
        </div>

      </div>
      </div>
    </>
  );
}
