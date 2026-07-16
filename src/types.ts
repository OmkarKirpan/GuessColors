export enum Result {
  Correct,
  Wrong,
}

// A snapshot of the game used to decide which achievements are unlocked.
export type AchievementContext = {
  score: number;
  streak: number;
  bestStreak: number;
  level: number;
};

export type Achievement = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  isUnlocked: (ctx: AchievementContext) => boolean;
};
