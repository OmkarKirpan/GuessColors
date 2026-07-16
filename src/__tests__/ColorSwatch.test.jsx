import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ColorSwatch } from "../components/ColorSwatch";
import { setPrefersReducedMotion } from "../test/setup";

test("renders the color as an inline background", () => {
  const { getByTestId } = render(
    <ColorSwatch color="#e09e3b" shakeTrigger={0} />,
  );

  const swatch = getByTestId("guess-me");
  expect(swatch.style.background).toBe("rgb(224, 158, 59)");
  expect(swatch).toHaveAttribute("data-shaking", "false");
});

test("runs the shake lifecycle when the trigger increments", async () => {
  const { getByTestId, rerender } = render(
    <ColorSwatch color="#e09e3b" shakeTrigger={0} />,
  );

  rerender(<ColorSwatch color="#e09e3b" shakeTrigger={1} />);

  expect(getByTestId("guess-me")).toHaveAttribute("data-shaking", "true");

  await waitFor(
    () =>
      expect(getByTestId("guess-me")).toHaveAttribute("data-shaking", "false"),
    { timeout: 2000 },
  );
});

test("does not shake when the user prefers reduced motion", async () => {
  setPrefersReducedMotion(true);

  const { getByTestId, rerender } = render(
    <ColorSwatch color="#e09e3b" shakeTrigger={0} />,
  );

  rerender(<ColorSwatch color="#e09e3b" shakeTrigger={1} />);

  expect(getByTestId("guess-me")).toHaveAttribute("data-shaking", "false");
});
