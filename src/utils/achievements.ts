import type { Achievement, AchievementContext } from "../types";

// Badges the player can earn. Each is a pure predicate over the current game
// snapshot, so unlocks are trivial to evaluate and test. Order here is the
// display order.
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-win",
    label: "First Win",
    emoji: "🎯",
    description: "Guess your first color.",
    isUnlocked: (ctx) => ctx.score >= 1,
  },
  {
    id: "score-10",
    label: "Getting Good",
    emoji: "⭐",
    description: "Reach a score of 10.",
    isUnlocked: (ctx) => ctx.score >= 10,
  },
  {
    id: "score-25",
    label: "Color Master",
    emoji: "🏆",
    description: "Reach a score of 25.",
    isUnlocked: (ctx) => ctx.score >= 25,
  },
  {
    id: "streak-5",
    label: "On Fire",
    emoji: "🔥",
    description: "Hit a 5-answer streak.",
    isUnlocked: (ctx) => ctx.bestStreak >= 5,
  },
  {
    id: "streak-10",
    label: "Unstoppable",
    emoji: "⚡",
    description: "Hit a 10-answer streak.",
    isUnlocked: (ctx) => ctx.bestStreak >= 10,
  },
  {
    id: "level-3",
    label: "Rising Star",
    emoji: "🚀",
    description: "Reach level 3.",
    isUnlocked: (ctx) => ctx.level >= 3,
  },
  {
    id: "level-5",
    label: "Chromatic Royalty",
    emoji: "👑",
    description: "Reach level 5.",
    isUnlocked: (ctx) => ctx.level >= 5,
  },
];

const BY_ID = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));

export function getAchievement(id: string): Achievement | undefined {
  return BY_ID.get(id);
}

// Returns the ids of achievements that are unlocked by `ctx` but were not
// already in `alreadyUnlocked` — i.e. the ones earned right now.
export function evaluateNewUnlocks(
  ctx: AchievementContext,
  alreadyUnlocked: readonly string[],
): string[] {
  const owned = new Set(alreadyUnlocked);
  return ACHIEVEMENTS.filter((a) => !owned.has(a.id) && a.isUnlocked(ctx)).map(
    (a) => a.id,
  );
}
