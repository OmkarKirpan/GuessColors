export type Stats = {
  highScore: number;
  bestStreak: number;
  xp: number;
  unlockedAchievements: string[];
};

const STORAGE_KEY = "guessColors.stats";
const DEFAULT_STATS: Stats = {
  highScore: 0,
  bestStreak: 0,
  xp: 0,
  unlockedAchievements: [],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;

    const parsed: unknown = JSON.parse(raw);
    if (
      !isRecord(parsed) ||
      typeof parsed.highScore !== "number" ||
      typeof parsed.bestStreak !== "number"
    ) {
      return DEFAULT_STATS;
    }

    // `xp` and `unlockedAchievements` were added later; tolerate saves that
    // predate them by falling back to the defaults for missing/invalid fields
    // instead of discarding the whole record. (An earlier build stored
    // `bestLevel` instead of `xp`; it is simply ignored — level is now derived
    // from the persisted xp.)
    const xp =
      typeof parsed.xp === "number" && parsed.xp >= 0
        ? parsed.xp
        : DEFAULT_STATS.xp;
    const unlockedAchievements =
      Array.isArray(parsed.unlockedAchievements) &&
      parsed.unlockedAchievements.every((id) => typeof id === "string")
        ? (parsed.unlockedAchievements as string[])
        : DEFAULT_STATS.unlockedAchievements;

    return {
      highScore: parsed.highScore,
      bestStreak: parsed.bestStreak,
      xp,
      unlockedAchievements,
    };
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
