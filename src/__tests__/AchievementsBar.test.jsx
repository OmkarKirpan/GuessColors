import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AchievementsBar } from "../components/AchievementsBar";
import { ACHIEVEMENTS } from "../utils/achievements";

test("renders every achievement with its locked/unlocked count", () => {
  const { getByText, getAllByRole } = render(
    <AchievementsBar unlocked={["first-win"]} />,
  );

  expect(getAllByRole("listitem")).toHaveLength(ACHIEVEMENTS.length);
  expect(getByText(`1 / ${ACHIEVEMENTS.length}`)).toBeInTheDocument();
});

test("conveys unlocked state through accessible labels, not color alone", () => {
  const { getByLabelText } = render(
    <AchievementsBar unlocked={["first-win"]} />,
  );

  expect(getByLabelText("First Win, unlocked")).toBeInTheDocument();
  expect(getByLabelText("On Fire, locked")).toBeInTheDocument();
});

test("shows nothing unlocked when the list is empty", () => {
  const { getByText } = render(<AchievementsBar unlocked={[]} />);
  expect(getByText(`0 / ${ACHIEVEMENTS.length}`)).toBeInTheDocument();
});
