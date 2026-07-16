import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { XpBar } from "../components/XpBar";
import { setPrefersReducedMotion } from "../test/setup";

test("renders the level label and progressbar aria values", () => {
  const progress = { level: 2, into: 10, needed: 40, ratio: 0.25 };
  const { getByRole, getByText } = render(
    <XpBar progress={progress} levelUpTrigger={0} />,
  );

  expect(getByText("Level 2")).toBeInTheDocument();

  const bar = getByRole("progressbar");
  expect(bar).toHaveAttribute("aria-valuenow", "10");
  expect(bar).toHaveAttribute("aria-valuemax", "40");
  expect(bar).toHaveAttribute("aria-valuemin", "0");
});

test("keeps rendering when a level-up flash is triggered", () => {
  const progress = { level: 3, into: 0, needed: 50, ratio: 0 };
  const { getByRole, rerender } = render(
    <XpBar progress={progress} levelUpTrigger={0} />,
  );

  rerender(<XpBar progress={progress} levelUpTrigger={1} />);
  expect(getByRole("progressbar")).toBeInTheDocument();
});

test("does not flash under reduced motion", () => {
  setPrefersReducedMotion(true);
  const progress = { level: 4, into: 5, needed: 60, ratio: 0.08 };
  const { getByRole, rerender } = render(
    <XpBar progress={progress} levelUpTrigger={0} />,
  );

  rerender(<XpBar progress={progress} levelUpTrigger={1} />);
  expect(getByRole("progressbar")).toBeInTheDocument();
});
