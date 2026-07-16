import {
  ACHIEVEMENTS,
  evaluateNewUnlocks,
  getAchievement,
} from "../utils/achievements";

const baseCtx = { score: 0, streak: 0, bestStreak: 0, level: 1 };

test("every achievement has the required shape", () => {
  for (const achievement of ACHIEVEMENTS) {
    expect(typeof achievement.id).toBe("string");
    expect(typeof achievement.label).toBe("string");
    expect(typeof achievement.emoji).toBe("string");
    expect(typeof achievement.isUnlocked).toBe("function");
  }
});

test("getAchievement looks up by id", () => {
  expect(getAchievement("first-win")?.label).toBe("First Win");
  expect(getAchievement("nope")).toBeUndefined();
});

test("first win unlocks on the first correct answer", () => {
  const unlocks = evaluateNewUnlocks({ ...baseCtx, score: 1 }, []);
  expect(unlocks).toContain("first-win");
});

test("does not re-report already-unlocked achievements", () => {
  const unlocks = evaluateNewUnlocks({ ...baseCtx, score: 1 }, ["first-win"]);
  expect(unlocks).not.toContain("first-win");
});

test("score, streak, and level thresholds each unlock their badge", () => {
  expect(evaluateNewUnlocks({ ...baseCtx, score: 10 }, [])).toContain(
    "score-10",
  );
  expect(evaluateNewUnlocks({ ...baseCtx, bestStreak: 5 }, [])).toContain(
    "streak-5",
  );
  expect(evaluateNewUnlocks({ ...baseCtx, level: 3 }, [])).toContain("level-3");
});

test("returns nothing when no thresholds are met", () => {
  expect(evaluateNewUnlocks(baseCtx, [])).toEqual([]);
});
