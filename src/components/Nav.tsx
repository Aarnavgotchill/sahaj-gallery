import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { sahajTransparentLogo as logoSahaj } from "@/assets/assets";

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Gallery" },
  { href: "/sahaj", label: "SAHAJ" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        scrolled
          ? "backdrop-blur-2xl bg-background/40 border-b border-border/30"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-14 md:py-6">
        <Link to="/" className="flex items-center gap-6" onClick={() => setMenuOpen(false)}>
          <img
            src={logoSahaj}
            alt="Sahaj Gallery"
            className="h-11 w-auto md:h-[58px]"
          />
          <div className="flex flex-col">
            <span className="font-micross whitespace-nowrap text-base tracking-[0.3em] text-foreground md:text-lg">
              SAHAJ GALLERY
            </span>
            <span className="font-micross text-[10px] tracking-[0.2em] uppercase text-foreground/80" style={{ height: "24px", lineHeight: "24px" }}>
              Art in Architecture
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="font-display text-[14px] tracking-[0.28em] uppercase text-muted-foreground transition-colors duration-500 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center justify-center md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="h-6 w-6 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out md:hidden ${
          menuOpen ? "max-h-80" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-0 border-t border-border/50 bg-background/95 backdrop-blur-xl px-6 py-4">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setMenuOpen(false)}
              className="font-display border-b border-border/30 py-4 text-sm tracking-[0.28em] uppercase text-muted-foreground transition-colors duration-300 hover:text-foreground last:border-0"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
