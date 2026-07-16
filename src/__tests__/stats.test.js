import { loadStats, saveStats } from "../utils/stats";

const DEFAULTS = {
  highScore: 0,
  bestStreak: 0,
  xp: 0,
  unlockedAchievements: [],
};

afterEach(() => {
  localStorage.clear();
});

test("returns zeroed defaults when nothing is stored", () => {
  expect(loadStats()).toEqual(DEFAULTS);
});

test("returns the persisted values when present", () => {
  const stats = {
    highScore: 5,
    bestStreak: 3,
    xp: 120,
    unlockedAchievements: ["first-win", "streak-5"],
  };
  saveStats(stats);

  expect(loadStats()).toEqual(stats);
});

test("falls back to defaults when the stored value is corrupt JSON", () => {
  localStorage.setItem("guessColors.stats", "{not valid json");

  expect(loadStats()).toEqual(DEFAULTS);
});

test("falls back to defaults when the stored value is the wrong shape", () => {
  localStorage.setItem("guessColors.stats", JSON.stringify({ highScore: "5" }));

  expect(loadStats()).toEqual(DEFAULTS);
});

test("migrates an older save that predates xp/achievements (and drops bestLevel)", () => {
  localStorage.setItem(
    "guessColors.stats",
    JSON.stringify({ highScore: 7, bestStreak: 4, bestLevel: 3 }),
  );

  expect(loadStats()).toEqual({
    highScore: 7,
    bestStreak: 4,
    xp: 0,
    unlockedAchievements: [],
  });
});

test("ignores an invalid unlockedAchievements array", () => {
  localStorage.setItem(
    "guessColors.stats",
    JSON.stringify({
      highScore: 2,
      bestStreak: 1,
      xp: 40,
      unlockedAchievements: [1, "first-win"],
    }),
  );

  expect(loadStats()).toEqual({
    highScore: 2,
    bestStreak: 1,
    xp: 40,
    unlockedAchievements: [],
  });
});
