// A tiny WebAudio blip generator. No assets — each sound is one or more short
// oscillator tones. Everything is guarded so it safely no-ops where WebAudio is
// unavailable (jsdom under test, private browsing, older browsers).

export type SoundKind = "correct" | "wrong" | "levelUp" | "achievement";

const MUTE_STORAGE_KEY = "guessColors.muted";

type Tone = {
  freq: number;
  start: number;
  duration: number;
  type?: OscillatorType;
};

// Each sound is a small score of tones (seconds are relative to play time).
const SCORES: Record<SoundKind, Tone[]> = {
  correct: [
    { freq: 587.33, start: 0, duration: 0.12 }, // D5
    { freq: 880.0, start: 0.09, duration: 0.16 }, // A5
  ],
  wrong: [{ freq: 155.56, start: 0, duration: 0.22, type: "sawtooth" }], // low Eb3
  levelUp: [
    { freq: 523.25, start: 0, duration: 0.12 }, // C5
    { freq: 659.25, start: 0.1, duration: 0.12 }, // E5
    { freq: 783.99, start: 0.2, duration: 0.18 }, // G5
  ],
  achievement: [
    { freq: 659.25, start: 0, duration: 0.1 }, // E5
    { freq: 987.77, start: 0.09, duration: 0.22 }, // B5
  ],
};

function readInitialMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

let muted = readInitialMuted();
let context: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  try {
    if (!context) context = new Ctor();
    if (context.state === "suspended") void context.resume();
    return context;
  } catch {
    return null;
  }
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(next: boolean): void {
  muted = next;
  try {
    localStorage.setItem(MUTE_STORAGE_KEY, String(next));
  } catch {
    // Storage may be unavailable; the in-memory flag still applies this session.
  }
}

export function playSound(kind: SoundKind): void {
  if (muted) return;
  const ctx = getContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    for (const tone of SCORES[kind]) {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = tone.type ?? "sine";
      oscillator.frequency.value = tone.freq;

      const startAt = now + tone.start;
      const endAt = startAt + tone.duration;
      // Quick attack, exponential release so blips don't click.
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(0.15, startAt + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(startAt);
      oscillator.stop(endAt + 0.02);
    }
  } catch {
    // Ignore any audio failure — sound is a non-essential enhancement.
  }
}
