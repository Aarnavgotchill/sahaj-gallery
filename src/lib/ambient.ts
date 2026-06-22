import { ambientAudio } from "@/assets/assets";

const audio = new Audio(ambientAudio);
audio.loop = true;
audio.preload = "auto";
audio.volume = 0.5;

let interacted = false;

export function play() {
  if (!audio.paused) return;
  audio.play().catch(() => {
    if (interacted) return;
    const onClick = () => {
      interacted = true;
      audio.play().catch(() => {});
      document.removeEventListener("click", onClick);
      document.removeEventListener("touchstart", onClick);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("touchstart", onClick);
  });
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
