import { useState } from "react";
import { isMuted, setMuted } from "../utils/sound";

export function SoundToggle() {
  const [muted, setMutedState] = useState(() => isMuted());

  function toggleMuted() {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  }

  return (
    <button
      type="button"
      className="fixed top-4 right-20 z-10 grid size-12 cursor-pointer place-items-center rounded-full bg-white text-xl shadow-lg ring-1 ring-slate-900/10 transition hover:scale-110 focus-visible:ring-4 focus-visible:ring-violet-500 motion-reduce:transition-none dark:bg-slate-800 dark:ring-white/20"
      aria-pressed={muted}
      onClick={toggleMuted}
    >
      <span aria-hidden="true">{muted ? "🔇" : "🔊"}</span>
      <span className="sr-only">{muted ? "Unmute sounds" : "Mute sounds"}</span>
    </button>
  );
}
