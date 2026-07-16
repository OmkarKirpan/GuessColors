// Points and progression math for the game.
//
// A correct answer awards BASE_POINTS multiplied by the current combo
// multiplier (a function of the running streak). Those points accumulate as XP,
// which drives the player's level. Difficulty is derived from the level
// (level - 1), so the very first level leaves the base round generation
// untouched — see `generateDistractor` in `color.ts`.

export const BASE_POINTS = 10;

// The combo multiplier climbs one step for every third consecutive correct
// answer, capped at 5x, so a long streak is worth noticeably more per answer.
//   streak 1-2 -> 1x, 3-5 -> 2x, 6-8 -> 3x, 9-11 -> 4x, 12+ -> 5x
export function getComboMultiplier(streak: number): number {
  if (streak <= 0) return 1;
  return Math.min(1 + Math.floor(streak / 3), 5);
}

// Cumulative XP required to *reach* a given level (level 1 starts at 0). Each
// level costs a little more than the last: advancing from level L costs
// (20 + 10 * L) XP. Level 2 therefore needs 30 XP — more than the 20 XP two
// correct answers can produce — which keeps the early game (and the seeded unit
// tests) at level 1, difficulty 0.
export function xpForLevel(level: number): number {
  const l = Math.max(1, Math.floor(level));
  if (l <= 1) return 0;
  const steps = l - 1;
  return 20 * steps + 5 * l * steps;
}

export function getLevel(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) {
    level += 1;
  }
  return level;
}

export type LevelProgress = {
  level: number;
  into: number;
  needed: number;
  ratio: number;
};

export function getLevelProgress(xp: number): LevelProgress {
  const level = getLevel(xp);
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  const needed = ceil - floor;
  const into = xp - floor;
  return {
    level,
    into,
    needed,
    ratio: needed > 0 ? into / needed : 0,
  };
}
