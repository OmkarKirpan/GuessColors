export type Stats = {
  highScore: number;
  bestStreak: number;
};

const STORAGE_KEY = "guessColors.stats";
const DEFAULT_STATS: Stats = { highScore: 0, bestStreak: 0 };

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;

    const parsed = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.highScore !== "number" ||
      typeof parsed.bestStreak !== "number"
    ) {
      return DEFAULT_STATS;
    }

    return { highScore: parsed.highScore, bestStreak: parsed.bestStreak };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: Stats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Storage may be unavailable (e.g. private browsing) or full; ignore.
  }
}
