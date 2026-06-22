import { ambientAudio } from "@/assets/assets";

const audio = new Audio(ambientAudio);
audio.loop = true;
audio.preload = "auto";
audio.volume = 0.5;
audio.muted = true;

audio.play().catch(() => {});

const unmute = () => {
  audio.muted = false;
  document.removeEventListener("click", unmute);
  document.removeEventListener("touchstart", unmute);
};
document.addEventListener("click", unmute, { once: true });
document.addEventListener("touchstart", unmute, { once: true });

export function play() {
  if (!audio.paused) return;
  audio.play().catch(() => {});
}

export function pause() {
  audio.pause();
}

export function stop() {
  audio.pause();
  audio.currentTime = 0;
}

export function volume(v: number) {
  audio.volume = Math.max(0, Math.min(1, v));
}
