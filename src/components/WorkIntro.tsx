import React, { useEffect, useRef, useState } from "react";
import styles from "./WorkIntro.module.css";

const VIDEO_SRC = "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/Video/download%20(1).mp4";
const AUDIO_SRC = "https://pub-e294075bc84a4927a3c47ae0aa8972d9.r2.dev/Sahaj%20Panel/Video/ReelAudio-80306.mp3";
const SESSION_KEY = "sahaj_work_intro_played";

declare global {
  interface Window {
    __sahaj_bg_audio?: HTMLAudioElement;
  }
}

function ensureBackgroundAudio(): HTMLAudioElement {
  if (window.__sahaj_bg_audio) return window.__sahaj_bg_audio;

  const a = new Audio(AUDIO_SRC);
  a.preload = "auto";
  a.loop = false;
  a.volume = 1.0;
  window.__sahaj_bg_audio = a;
  return a;
}

function fadeVolume(audio: HTMLAudioElement, from: number, to: number, duration = 500) {
  const start = performance.now();
  const diff = to - from;
  audio.volume = Math.max(0, Math.min(1, from));

  function step(now: number) {
    const t = Math.min(1, (now - start) / duration);
    audio.volume = Math.max(0, Math.min(1, from + diff * t));
    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

export default function WorkIntro({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem(SESSION_KEY);
    } catch (e) {
      return true;
    }
  });
  const [mounted, setMounted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!showIntro) return;

    const audio = ensureBackgroundAudio();

    // Start background audio immediately (singleton)
    audio.play().catch(() => {
      // Autoplay may be blocked; still keep the instance for later user interaction.
    });

    const video = videoRef.current;
    if (!video) return;

    // Try autoplay with original audio
    video.volume = 1.0;
    video.play().catch(() => {
      // If autoplay blocked, do nothing — audio may start on user interaction later.
    });

    function handleEnded() {
      // mark session so intro doesn't play again this session
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch (e) {}

      // Fade audio to 20% over ~500ms
      fadeVolume(audio, audio.volume, 0.2, 500);

      // Fade out video then hide intro
      if (containerRef.current) containerRef.current.classList.add(styles.fading);
      setTimeout(() => setShowIntro(false), 550);
    }

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
    };
  }, [showIntro]);

  useEffect(() => {
    // cleanup on unmount
    return () => setMounted(false);
  }, []);

  const handleSkip = async () => {
    const audio = ensureBackgroundAudio();

    // Stop video
    const video = videoRef.current;
    if (video) {
      try {
        video.pause();
      } catch (e) {}
    }

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch (e) {}

    // Fade audio to 20%
    fadeVolume(audio, audio.volume, 0.2, 500);

    if (containerRef.current) containerRef.current.classList.add(styles.fading);
    setTimeout(() => setShowIntro(false), 550);
  };

  // Render: when intro is active, overlay the video and keep children hidden visually.
  return (
    <div className={styles.wrapper} aria-hidden={showIntro ? "false" : "true"}>
      <div
        ref={containerRef}
        className={`${styles.introContainer} ${showIntro ? styles.visible : styles.hidden}`}
      >
        <video
          ref={videoRef}
          className={styles.video}
          src={VIDEO_SRC}
          playsInline
          // do not set muted — original audio required
          controls={false}
          preload="auto"
        />

        <button className={styles.skipButton} onClick={handleSkip} aria-label="Skip Video">
          Skip Video
        </button>
      </div>

      <div className={`${styles.content} ${showIntro ? styles.contentHidden : styles.contentVisible}`}>
        {children}
      </div>
    </div>
  );
}
