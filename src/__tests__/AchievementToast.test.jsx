import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AchievementToast } from "../components/AchievementToast";

const achievement = {
  id: "first-win",
  label: "First Win",
  emoji: "🎯",
  description: "Guess your first color.",
  isUnlocked: () => true,
  nonce: 1,
};

test("renders no toast content when there is no achievement", () => {
  const { container } = render(<AchievementToast achievement={null} />);
  expect(container.textContent).not.toContain("Achievement unlocked");
});

test("announces a newly unlocked achievement", () => {
  const { getByText, rerender } = render(
    <AchievementToast achievement={null} />,
  );

  rerender(<AchievementToast achievement={achievement} />);

  expect(getByText("Achievement unlocked")).toBeInTheDocument();
  expect(getByText("First Win")).toBeInTheDocument();
});
