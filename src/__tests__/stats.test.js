import { loadStats, saveStats } from "../utils/stats";

afterEach(() => {
  localStorage.clear();
});

test("returns zeroed defaults when nothing is stored", () => {
  expect(loadStats()).toEqual({ highScore: 0, bestStreak: 0 });
});

test("returns the persisted values when present", () => {
  saveStats({ highScore: 5, bestStreak: 3 });

  expect(loadStats()).toEqual({ highScore: 5, bestStreak: 3 });
});

test("falls back to defaults when the stored value is corrupt JSON", () => {
  localStorage.setItem("guessColors.stats", "{not valid json");

  expect(loadStats()).toEqual({ highScore: 0, bestStreak: 0 });
});

test("falls back to defaults when the stored value is the wrong shape", () => {
  localStorage.setItem("guessColors.stats", JSON.stringify({ highScore: "5" }));

  expect(loadStats()).toEqual({ highScore: 0, bestStreak: 0 });
});
