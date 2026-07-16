import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SoundToggle } from "../components/SoundToggle";

afterEach(() => {
  localStorage.clear();
});

test("toggles mute state and persists it", () => {
  const { getByRole } = render(<SoundToggle />);
  const button = getByRole("button");

  expect(button).toHaveAttribute("aria-pressed", "false");

  fireEvent.click(button);
  expect(button).toHaveAttribute("aria-pressed", "true");
  expect(localStorage.getItem("guessColors.muted")).toBe("true");

  fireEvent.click(button);
  expect(button).toHaveAttribute("aria-pressed", "false");
  expect(localStorage.getItem("guessColors.muted")).toBe("false");
});

test("exposes an accessible label", () => {
  const { getByText } = render(<SoundToggle />);
  expect(getByText("Mute sounds")).toBeInTheDocument();
});
