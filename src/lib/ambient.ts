import { ambientAudio } from "@/assets/assets";

let audio: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio(ambientAudio);
    audio.loop = true;
    audio.preload = "none";
    audio.volume = 0.5;
    audio.muted = true;
  }
  return audio;
}

const unmute = () => {
  const a = getAudio();
  a.muted = false;
  document.removeEventListener("click", unmute);
  document.removeEventListener("touchstart", unmute);
};
document.addEventListener("click", unmute, { once: true });
document.addEventListener("touchstart", unmute, { once: true });

export function play() {
  const a = getAudio();
  if (!a.paused) return;
  a.play().catch(() => {});
}

export function pause() {
  const a = getAudio();
  a.pause();
}

export function stop() {
  const a = getAudio();
  a.pause();
  a.currentTime = 0;
}

export function volume(v: number) {
  const a = getAudio();
  a.volume = Math.max(0, Math.min(1, v));
}
