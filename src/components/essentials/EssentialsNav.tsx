import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { NAV_LETTERS } from "@/data/essentialsData";
import type { EssentialsKey } from "@/data/essentialsData";

export default function EssentialsNav({ activeKey }: { activeKey: string }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = useCallback(
    (key: EssentialsKey) =>
      navigate({ to: "/essentials-viewer", search: { e: key }, replace: true }),
    [navigate],
  );

  const goBack = useCallback(
    () => navigate({ to: "/work", search: {}, replace: true }),
    [navigate],
  );

  return (
    <>
      <header
        className={`sticky inset-x-0 top-0 z-50 w-full transition-all duration-700 ${
          scrolled
            ? "bg-background/95 backdrop-blur-2xl border-b border-border/30"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-center px-6 pt-[calc(env(safe-area-inset-top,0px)+24px)] pb-5 md:px-14 md:pt-[calc(env(safe-area-inset-top,0px)+32px)] md:pb-6">
          <nav className="flex items-center gap-5 md:gap-8">
            {NAV_LETTERS.map((link) => (
              <button
                key={link.key}
                onClick={() => goTo(link.key as EssentialsKey)}
                className="flex flex-col items-center gap-0 cursor-pointer"
              >
                <span
                  className={`font-display text-[16px] md:text-[20px] tracking-[0.28em] uppercase transition-colors duration-500 ${
                    activeKey === link.key
                      ? "text-[#C8A86C]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </span>
                {activeKey === link.key && (
                  <span className="text-[#C8A86C] text-[14px] md:text-[16px] leading-none -mt-1">
                    _
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <button
        onClick={goBack}
        aria-label="Close"
        className="fixed top-[calc(env(safe-area-inset-top,0px)+20px)] right-5 z-[60] flex items-center justify-center w-8 h-8 rounded-full border border-border/50 bg-background/60 backdrop-blur text-muted-foreground/60 transition-colors duration-300 hover:text-[var(--gold)] hover:border-[var(--gold)] cursor-pointer md:top-[calc(env(safe-area-inset-top,0px)+24px)] md:right-6 md:w-9 md:h-9"
      >
        <X size={16} strokeWidth={1.5} />
      </button>
    </>
  );
}
