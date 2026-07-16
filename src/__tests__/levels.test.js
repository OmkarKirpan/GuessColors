import {
  BASE_POINTS,
  getComboMultiplier,
  getLevel,
  getLevelProgress,
  xpForLevel,
} from "../utils/levels";

test("combo multiplier climbs every third streak, capped at 5", () => {
  expect(getComboMultiplier(0)).toBe(1);
  expect(getComboMultiplier(1)).toBe(1);
  expect(getComboMultiplier(2)).toBe(1);
  expect(getComboMultiplier(3)).toBe(2);
  expect(getComboMultiplier(5)).toBe(2);
  expect(getComboMultiplier(6)).toBe(3);
  expect(getComboMultiplier(9)).toBe(4);
  expect(getComboMultiplier(12)).toBe(5);
  expect(getComboMultiplier(100)).toBe(5);
});

test("xpForLevel starts at 0 and increases per level", () => {
  expect(xpForLevel(1)).toBe(0);
  expect(xpForLevel(0)).toBe(0);
  expect(xpForLevel(2)).toBe(30);
  expect(xpForLevel(3)).toBe(70);
  expect(xpForLevel(4)).toBeGreaterThan(xpForLevel(3));
});

test("two base-point answers stay at level 1 (protects seeded tests)", () => {
  // First two correct answers award BASE_POINTS each (combo 1x).
  expect(getLevel(BASE_POINTS * 2)).toBe(1);
  expect(getLevel(0)).toBe(1);
});

test("getLevel advances once the cumulative threshold is met", () => {
  expect(getLevel(xpForLevel(2))).toBe(2);
  expect(getLevel(xpForLevel(2) - 1)).toBe(1);
  expect(getLevel(xpForLevel(3))).toBe(3);
});

test("getLevelProgress reports position within the current level", () => {
  const atFloor = getLevelProgress(xpForLevel(2));
  expect(atFloor.level).toBe(2);
  expect(atFloor.into).toBe(0);
  expect(atFloor.ratio).toBe(0);

  const midway = getLevelProgress(xpForLevel(2) + 5);
  expect(midway.level).toBe(2);
  expect(midway.into).toBe(5);
  expect(midway.needed).toBe(xpForLevel(3) - xpForLevel(2));
  expect(midway.ratio).toBeCloseTo(5 / midway.needed);
});
