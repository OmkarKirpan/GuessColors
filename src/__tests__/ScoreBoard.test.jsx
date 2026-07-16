import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ScoreBoard } from "../components/ScoreBoard";

test("renders all four stats with exact labels", () => {
  const { getByText } = render(
    <ScoreBoard
      score={3}
      streak={2}
      highScore={7}
      bestStreak={4}
      comboMultiplier={1}
    />,
  );

  expect(getByText("Score: 3")).toBeInTheDocument();
  expect(getByText("Streak: 2")).toBeInTheDocument();
  expect(getByText("Best Score: 7")).toBeInTheDocument();
  expect(getByText("Best Streak: 4")).toBeInTheDocument();
});

test("shows a combo badge only when the multiplier exceeds one", () => {
  const { queryByText, rerender } = render(
    <ScoreBoard
      score={2}
      streak={2}
      highScore={2}
      bestStreak={2}
      comboMultiplier={1}
    />,
  );

  expect(queryByText(/Combo/)).not.toBeInTheDocument();

  rerender(
    <ScoreBoard
      score={3}
      streak={3}
      highScore={3}
      bestStreak={3}
      comboMultiplier={2}
    />,
  );

  expect(queryByText("Combo ×2", { exact: false })).toBeInTheDocument();
});

test("celebrates streak milestones with a flame, but not other streaks", () => {
  const { getByText, rerender, queryByText } = render(
    <ScoreBoard score={5} streak={5} highScore={5} bestStreak={5} />,
  );

  expect(getByText("Streak: 5").textContent).toContain("🔥");

  rerender(<ScoreBoard score={6} streak={6} highScore={6} bestStreak={6} />);

  expect(getByText("Streak: 6").textContent).not.toContain("🔥");
  expect(queryByText(/🔥/)).not.toBeInTheDocument();
});

test("highlights the best-score and best-streak chips when a record is beaten", () => {
  const { getByText, rerender } = render(
    <ScoreBoard score={1} streak={1} highScore={1} bestStreak={1} />,
  );

  const beforeClass = getByText("Best Score: 1").className;
  expect(beforeClass).not.toContain("bg-amber");

  rerender(<ScoreBoard score={2} streak={2} highScore={2} bestStreak={2} />);

  expect(getByText("Best Score: 2").className).toContain("bg-amber");
  expect(getByText("Best Streak: 2").className).toContain("bg-amber");
});

test("keeps each stat readable as a single text run for exact-text queries", () => {
  const { getByText } = render(
    <ScoreBoard score={0} streak={0} highScore={0} bestStreak={0} />,
  );

  expect(getByText("Score: 0", { exact: true })).toBeInTheDocument();
  expect(getByText("Streak: 0", { exact: true })).toBeInTheDocument();
});
