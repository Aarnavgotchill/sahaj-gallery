import { useState, useEffect, useRef } from "react";

const SAFETY_TIMEOUT = 15000;

export function useImagePreloader(imageUrls: string[]) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const mountedRef = useRef(true);
  const urlsKey = imageUrls.join(",");

  useEffect(() => {
    mountedRef.current = true;
    setProgress(0);
    setIsLoaded(false);

    if (!imageUrls.length) {
      setProgress(100);
      setIsLoaded(true);
      return;
    }

    let loaded = 0;
    const total = imageUrls.length;
    let completed = false;

    const safetyTimer = setTimeout(() => {
      if (!mountedRef.current || completed) return;
      completed = true;
      setProgress(100);
      setIsLoaded(true);
    }, SAFETY_TIMEOUT);

    const onLoadOrError = () => {
      if (!mountedRef.current || completed) return;
      loaded++;
      const pct = Math.round((loaded / total) * 100);
      setProgress(pct);
      if (loaded === total) {
        completed = true;
        clearTimeout(safetyTimer);
        setIsLoaded(true);
      }
    };

    for (const url of imageUrls) {
      const img = new Image();
      img.onload = onLoadOrError;
      img.onerror = onLoadOrError;
      img.src = url;
    }

    return () => {
      mountedRef.current = false;
      clearTimeout(safetyTimer);
    };
  }, [urlsKey]);

  return { progress, isLoaded };
}
