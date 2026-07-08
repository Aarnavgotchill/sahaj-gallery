import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { X } from "lucide-react";

type ArtSlug = "s" | "a" | "h" | "a-2" | "j";

const LINKS: { slug: ArtSlug; label: string }[] = [
  { slug: "s", label: "S" },
  { slug: "a", label: "A" },
  { slug: "h", label: "H" },
  { slug: "a-2", label: "A" },
  { slug: "j", label: "J" },
];

export default function ArtNav() {
  const navigate = useNavigate();
  const { slug } = useSearch({ from: "/art-viewer" });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = useCallback(
    (s: ArtSlug) => navigate({ to: "/art-viewer", search: { slug: s }, replace: true }),
    [navigate],
  );

  const goBack = useCallback(
    () => navigate({ to: "/work", search: {}, replace: true }),
    [navigate],
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          scrolled
            ? "backdrop-blur-2xl bg-background/40 border-b border-border/30"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-center px-6 py-5 md:px-14 md:py-6">
          <nav className="flex items-center gap-10">
            {LINKS.map((link) => (
              <button
                key={link.slug}
                onClick={() => goTo(link.slug)}
                className="flex flex-col items-center gap-0 cursor-pointer"
              >
                <span className={`font-display text-[20px] tracking-[0.28em] uppercase transition-colors duration-500 ${
                  slug === link.slug
                    ? "text-[#C8A86E]"
                    : "text-muted-foreground hover:text-foreground"
                }`}>
                  {link.label}
                </span>
                {slug === link.slug && (
                  <span className="text-[#C8A86E] text-[16px] leading-none -mt-1">_</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <button
        onClick={goBack}
        aria-label="Close"
        className="fixed top-5 right-5 z-[60] flex items-center justify-center w-8 h-8 rounded-full border border-border/50 bg-background/60 backdrop-blur text-muted-foreground/60 transition-colors duration-300 hover:text-[var(--gold)] hover:border-[var(--gold)] cursor-pointer md:top-6 md:right-6 md:w-9 md:h-9"
      >
        <X size={16} strokeWidth={1.5} />
      </button>
    </>
  );
}
