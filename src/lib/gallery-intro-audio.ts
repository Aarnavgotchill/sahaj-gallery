import {
  galleryIntroVideoLandscape,
  galleryIntroVideoPortrait,
} from "@/assets/assets";

let primedAudio: HTMLAudioElement | null = null;

function introSource() {
  return window.matchMedia("(orientation: portrait)").matches
    ? galleryIntroVideoPortrait
    : galleryIntroVideoLandscape;
}

/**
 * Start the intro soundtrack inside the Gallery link's trusted click event.
 * The gallery route is lazy-loaded, so waiting for it to mount loses the
 * browser's user-activation window and sound autoplay is rejected.
 */
export function primeGalleryIntroAudio() {
  primedAudio?.pause();
  const audio = new Audio(introSource());
  audio.preload = "auto";
  audio.volume = 0.01;
  primedAudio = audio;
  void audio.play().catch(() => {
    if (primedAudio === audio) primedAudio = null;
  });
}

export function takePrimedGalleryIntroAudio() {
  const audio = primedAudio;
  primedAudio = null;
  return audio;
}
