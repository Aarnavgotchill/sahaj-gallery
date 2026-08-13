import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, X, ArrowLeft } from "lucide-react";
import { getPageContent, getAllSlugs, ArtistPageData } from "@/lib/artistPageData";
import {
  sahajTransparentLogo,
  ndhLogo4K,
} from "@/assets/assets";
import { usePortraitNoScroll } from "@/lib/portrait";

export { getPageContent, getAllSlugs };
export type { ArtistPageData };

/* ─── Types ─── */
export interface Artwork {
  id: string;
  catalogNo: string;
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  image: string;
  width: number;
  height: number;
}

/* ─── CSS ─── */
const CSS = `
/* Reset for the artist page */
.artist-page-root {
  min-height: 100dvh;
  background: #1a0e28;
  color: rgba(255,255,255,0.9);
  font-family: var(--font-sans, 'Montserrat', sans-serif);
  display: flex;
  flex-direction: column;
}

/* ── Nav ── */
.artist-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background 0.5s, border-color 0.5s, backdrop-filter 0.5s;
}
.artist-nav.scrolled {
  background: rgba(26,14,40,0.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(201,169,110,0.15);
}
.artist-nav-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.artist-nav-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
}
.artist-nav-logo img {
  height: 32px;
  width: auto;
}
.artist-nav-logo-text {
  display: flex;
  flex-direction: column;
}
.artist-nav-title {
  font-family: 'Cormorant Garamond', 'Gambetta', Georgia, serif;
  font-size: clamp(18px, 2.5vw, 26px);
  letter-spacing: 0.3em;
  color: #c9a96e;
  text-transform: uppercase;
  line-height: 1;
}
.artist-nav-sub {
  font-size: 9px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: rgba(180,168,200,0.7);
  margin-top: 4px;
}
.artist-nav-back {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(201,169,110,0.6);
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  transition: color 0.3s;
}
.artist-nav-back:hover { color: #c9a96e; }
.artist-nav-tabs {
  display: flex;
  align-items: center;
  gap: clamp(16px, 3vw, 48px);
}
.artist-nav-tab {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(16px, 2vw, 22px);
  letter-spacing: 0.2em;
  color: rgba(255,255,255,0.35);
  text-decoration: none;
  transition: color 0.3s;
  padding: 4px 0;
  position: relative;
}
.artist-nav-tab::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: #c9a96e;
  transition: width 0.4s ease;
}
.artist-nav-tab:hover { color: rgba(255,255,255,0.7); }
.artist-nav-tab.active { color: #c9a96e; }
.artist-nav-tab.active::after { width: 100%; }

/* ── Hero section ── */
.artist-hero {
  padding-top: 120px;
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  position: relative;
  overflow: hidden;
}
@media (min-width: 1024px) {
  .artist-hero { grid-template-columns: 5fr 7fr; }
}
.artist-hero-info {
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0 32px 60px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  opacity: 0;
  transform: translateY(30px);
  animation: artistFadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.1s forwards;
}
@media (min-width: 1024px) {
  .artist-hero-info {
    padding: 0 32px 80px 64px;
    grid-column: 1;
  }
}
.artist-hero-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(52px, 9vw, 120px);
  line-height: 0.92;
  letter-spacing: -0.01em;
  color: rgba(255,255,255,0.95);
  margin: 0;
}
.artist-hero-tagline {
  margin-top: clamp(18px, 3vh, 32px);
  font-size: clamp(10px, 1vw, 13px);
  letter-spacing: 0.45em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
  max-width: 380px;
  line-height: 1.6;
}
.artist-hero-img-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 55vh;
  min-height: 320px;
  opacity: 0;
  transform: translateY(40px);
  animation: artistFadeUp 1.2s cubic-bezier(0.22,1,0.36,1) 0.2s forwards;
}
@media (min-width: 1024px) {
  .artist-hero-img-wrap {
    height: auto;
    min-height: unset;
    order: 1;
    grid-column: 2;
    align-self: stretch;
  }
}
.artist-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}
.artist-hero-divider {
  border: none;
  border-top: 1px solid rgba(201,169,110,0.15);
  margin: 0;
}

/* ── Artwork grid ── */
.artist-gallery-section {
  padding: clamp(60px, 10vh, 120px) 32px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
.artist-gallery-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(24px, 4vw, 48px);
}
@media (min-width: 540px) { .artist-gallery-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .artist-gallery-grid { grid-template-columns: repeat(3, 1fr); } }

.artist-card {
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  width: 100%;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1);
}
.artist-card.visible { opacity: 1; transform: translateY(0); }

.artist-card-img-wrap {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: rgba(255,255,255,0.04);
}
.artist-card-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 1.4s cubic-bezier(0.22,1,0.36,1);
  display: block;
}
.artist-card:hover .artist-card-img { transform: scale(1.045); }

.artist-card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0);
  transition: background 0.7s;
  pointer-events: none;
}
.artist-card:hover .artist-card-overlay { background: rgba(255,255,255,0.04); }

.artist-card-meta {
  margin-top: 16px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}
.artist-card-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(16px, 1.4vw, 20px);
  font-style: italic;
  line-height: 1.3;
  color: rgba(255,255,255,0.9);
}
.artist-card-sub {
  font-size: 12px;
  color: rgba(255,255,255,0.45);
  margin-top: 4px;
}
.artist-card-catalog {
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── Lightbox ── */
.artist-lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: #1a0e28;
  display: flex;
  opacity: 0;
  animation: artistFadeIn 0.4s ease forwards;
}
.artist-lightbox-close {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 20;
  color: rgba(255,255,255,0.35);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
  line-height: 0;
}
.artist-lightbox-close:hover { color: rgba(255,255,255,0.8); }
.artist-lightbox-info {
  width: clamp(260px, 32vw, 440px);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(32px, 5vw, 80px) clamp(24px, 4vw, 64px);
  gap: 24px;
  opacity: 0;
  transform: translateX(-20px);
  animation: artistSlideIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s forwards;
}
@media (max-width: 767px) {
  .artist-lightbox { flex-direction: column; }
  .artist-lightbox-info {
    width: 100%;
    padding: 80px 24px 24px;
    flex-shrink: 0;
    height: auto;
  }
}
.artist-lightbox-label {
  font-size: 11px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #c9a96e;
}
.artist-lightbox-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(22px, 3vw, 36px);
  font-style: italic;
  line-height: 1.2;
  color: rgba(255,255,255,0.95);
}
.artist-lightbox-details { display: flex; flex-direction: column; gap: 6px; }
.artist-lightbox-detail { font-size: 13px; color: rgba(255,255,255,0.5); }
.artist-lightbox-catalog {
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
}
.artist-lightbox-img-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(20px, 4vw, 64px);
  position: relative;
}
.artist-lightbox-img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  display: block;
  user-select: none;
  pointer-events: none;
  opacity: 0;
  transform: scale(0.97);
  animation: artistScaleIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
}
.artist-lb-arr {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.25);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s;
  line-height: 0;
  padding: 12px;
  z-index: 10;
}
.artist-lb-arr:hover { color: rgba(255,255,255,0.7); }
.artist-lb-arr.prev { left: clamp(4px, 1vw, 16px); }
.artist-lb-arr.next { right: clamp(4px, 1vw, 16px); }
.artist-lb-counter {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  letter-spacing: 0.35em;
  color: rgba(255,255,255,0.25);
  white-space: nowrap;
}

/* ── Footer ── */
.artist-footer {
  border-top: 1px solid rgba(201,169,110,0.12);
  background: rgba(26,14,40,0.95);
  padding: 20px 32px;
  margin-top: auto;
}
.artist-footer-inner {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.artist-footer-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(16px, 2vw, 22px);
  letter-spacing: 0.3em;
  color: #c9a96e;
  text-transform: uppercase;
}
.artist-footer-ndh {
  display: flex;
  align-items: center;
  gap: 10px;
}
.artist-footer-ndh img {
  height: 36px;
  width: auto;
  opacity: 0.75;
}

/* ── Keyframes ── */
@keyframes artistFadeUp {
  to { opacity: 1; transform: translateY(0); }
}
@keyframes artistFadeIn {
  to { opacity: 1; }
}
@keyframes artistSlideIn {
  to { opacity: 1; transform: translateX(0); }
}
@keyframes artistScaleIn {
  to { opacity: 1; transform: scale(1); }
}
`;

/* ─── Sub-components ─── */

function ArtistNav({
  artistName,
  currentSlug,
  onBack,
}: {
  artistName: string;
  currentSlug: string;
  onBack: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const TABS = [
    { slug: "s", label: "S" },
    { slug: "a", label: "A" },
    { slug: "h", label: "H" },
    { slug: "a-2", label: "A" },
    { slug: "j", label: "J" },
  ];

  return (
    <header className={`artist-nav${scrolled ? " scrolled" : ""}`}>
      <div className="artist-nav-inner">
        <Link to="/work" className="artist-nav-logo">
          <img src={sahajTransparentLogo} alt="SAHAJ GALLERY" />
          <div className="artist-nav-logo-text">
            <span className="artist-nav-title">SAHAJ GALLERY</span>
            <span className="artist-nav-sub">Art in Architecture</span>
          </div>
        </Link>

        <nav className="artist-nav-tabs">
          {TABS.map((tab) => (
            <Link
              key={tab.slug}
              to="/artist/$slug"
              params={{ slug: tab.slug }}
              className={`artist-nav-tab${currentSlug === tab.slug ? " active" : ""}`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <button className="artist-nav-back" onClick={onBack}>
          <ArrowLeft size={14} strokeWidth={1.4} />
          Gallery
        </button>
      </div>
    </header>
  );
}

function Lightbox({
  artworks,
  activeIndex,
  artistName,
  onClose,
  onNext,
  onPrev,
}: {
  artworks: Artwork[];
  activeIndex: number;
  artistName: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const artwork = artworks[activeIndex];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = prev;
    };
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className="artist-lightbox"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        className="artist-lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={22} strokeWidth={1.2} />
      </button>

      {/* Info panel */}
      <div
        className="artist-lightbox-info"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="artist-lightbox-label">{artistName}</p>
        <h2 className="artist-lightbox-title">{artwork.title}</h2>
        <div className="artist-lightbox-details">
          <p className="artist-lightbox-detail">{artwork.year}</p>
          <p className="artist-lightbox-detail">{artwork.medium}</p>
          <p className="artist-lightbox-detail">{artwork.dimensions}</p>
        </div>
        <span className="artist-lightbox-catalog">{artwork.catalogNo}</span>
      </div>

      {/* Image panel */}
      <div
        className="artist-lightbox-img-wrap"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="artist-lb-arr prev"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          aria-label="Previous"
        >
          <ChevronLeft size={32} strokeWidth={1.2} />
        </button>

        <img
          key={artwork.id}
          src={artwork.image}
          alt={`${artwork.title}, ${artwork.year}`}
          className="artist-lightbox-img"
        />

        <button
          className="artist-lb-arr next"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          aria-label="Next"
        >
          <ChevronRight size={32} strokeWidth={1.2} />
        </button>

        <span className="artist-lb-counter">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(artworks.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

function ArtworkCard({
  artwork,
  onOpen,
  delay,
}: {
  artwork: Artwork;
  onOpen: () => void;
  delay: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.disconnect();
        }
      },
      { rootMargin: "60px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const aspectRatio = `${artwork.width} / ${artwork.height}`;

  return (
    <button
      ref={ref}
      type="button"
      className={`artist-card${visible ? " visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={onOpen}
      aria-label={`View ${artwork.title}, ${artwork.year}`}
    >
      <div className="artist-card-img-wrap" style={{ aspectRatio }}>
        <img
          src={artwork.image}
          alt={`${artwork.title}, ${artwork.year}, ${artwork.medium}`}
          className="artist-card-img"
          loading="lazy"
          decoding="async"
        />
        <div className="artist-card-overlay" />
      </div>
      <div className="artist-card-meta">
        <div>
          <p className="artist-card-title">{artwork.title}</p>
          <p className="artist-card-sub">
            {artwork.year} · {artwork.medium}
          </p>
        </div>
        <span className="artist-card-catalog">{artwork.catalogNo}</span>
      </div>
    </button>
  );
}

/* ─── Main Page Component ─── */

export function ArtistPage({ slug }: { slug: string }) {
  usePortraitNoScroll();
  const navigate = useNavigate();
  const data = getPageContent(slug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const artworks = (data?.artworks ?? []) as Artwork[];
  const total = artworks.length;

  const openLightbox = useCallback((i: number) => setLightboxIndex(i), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const nextLightbox = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % total)),
    [total],
  );
  const prevLightbox = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + total) % total)),
    [total],
  );

  const goBack = useCallback(() => {
    navigate({ to: "/work" });
  }, [navigate]);

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (!data) {
    return (
      <div className="artist-page-root" style={{ justifyContent: "center", alignItems: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Artist not found.</p>
      </div>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="artist-page-root">
        {/* Nav */}
        <ArtistNav
          artistName={data.name}
          currentSlug={slug}
          onBack={goBack}
        />

        {/* Hero */}
        <section className="artist-hero">
          <div className="artist-hero-info">
            <h1 className="artist-hero-name">{data.name}</h1>
            <p className="artist-hero-tagline">{data.tagline}</p>
          </div>
          <div className="artist-hero-img-wrap">
            <img
              src={data.heroImage}
              alt={`Hero image for ${data.name}`}
              className="artist-hero-img"
            />
          </div>
        </section>

        <hr className="artist-hero-divider" />

        {/* Artwork Grid */}
        <section className="artist-gallery-section">
          <div className="artist-gallery-grid">
            {artworks.map((artwork, i) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onOpen={() => openLightbox(i)}
                delay={(i % 3) * 80}
              />
            ))}
          </div>
        </section>

        {/* Footer — same as main gallery */}
        <footer className="artist-footer">
          <div className="artist-footer-inner">
            <span className="artist-footer-name">SAHAJ GALLERY</span>
            <div className="artist-footer-ndh">
              <img src={ndhLogo4K} alt="NDH House" />
            </div>
          </div>
        </footer>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          artworks={artworks}
          activeIndex={lightboxIndex}
          artistName={data.name}
          onClose={closeLightbox}
          onNext={nextLightbox}
          onPrev={prevLightbox}
        />
      )}
    </>
  );
}
