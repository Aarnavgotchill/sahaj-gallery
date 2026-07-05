"use client";

import { useCallback, useEffect, useState } from "react";

export function useLightbox(total: number) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const open = useCallback((index: number) => setActiveIndex(index), []);
  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % total)),
    [total]
  );
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + total) % total)),
    [total]
  );

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    document.addEventListener("keydown", onKeyDown);
    // Lock body scroll while the lightbox is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex, close, next, prev]);

  return { activeIndex, open, close, next, prev, isOpen: activeIndex !== null };
}
