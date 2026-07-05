"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/s", label: "S" },
  { href: "/a", label: "A" },
  { href: "/h", label: "H" },
  { href: "/a-2", label: "A" },
  { href: "/j", label: "J" },
];

export default function SiteNav({ artistName }: { artistName: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-gallery-header/90 backdrop-blur-md border-b border-gallery-border/50"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-header items-center justify-between px-6 py-6 md:px-14 md:py-8">
        <Link href="/" className="flex items-center gap-4 no-underline">
          <img src="/sahaj-logo.webp" alt="SAHAJ GALLERY" className="h-9 w-auto md:h-10" />
          <div className="flex flex-col">
            <span className="font-display text-2xl tracking-widest text-gallery-gold uppercase leading-none md:text-3xl">
              {artistName}
            </span>
            <span className="kicker mt-1 leading-none">Art in Architecture</span>
          </div>
        </Link>

        <ul className="hidden items-center gap-12 md:flex md:gap-16">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`font-label text-xs uppercase tracking-widest2 transition-colors duration-300 hover:text-gallery-gold md:text-sm ${
                  pathname === link.href ? "text-gallery-gold" : "text-gallery-muted"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="md:hidden text-gallery-muted hover:text-gallery-gold transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-gallery-border/50 bg-gallery-header md:hidden">
          <ul className="flex flex-col gap-6 px-6 py-10 md:px-14">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`font-label text-base uppercase tracking-widest2 transition-colors duration-300 hover:text-gallery-gold ${
                    pathname === link.href ? "text-gallery-gold" : "text-gallery-muted"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
