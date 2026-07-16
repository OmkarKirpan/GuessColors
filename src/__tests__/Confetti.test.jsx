import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Confetti } from "../components/Confetti";
import { setPrefersReducedMotion } from "../test/setup";

test("renders an idle container before any trigger", () => {
  const { container } = render(<Confetti trigger={0} />);
  const root = container.querySelector("[data-confetti]");
  expect(root).toHaveAttribute("data-confetti", "idle");
});

test("emits a particle burst when the trigger increments", () => {
  const { container, rerender } = render(<Confetti trigger={0} />);

  rerender(<Confetti trigger={1} />);

  const root = container.querySelector("[data-confetti]");
  expect(root).toHaveAttribute("data-confetti", "active");
  expect(root.querySelectorAll("span").length).toBeGreaterThan(0);
});

test("renders nothing under reduced motion", () => {
  setPrefersReducedMotion(true);
  const { container, rerender } = render(<Confetti trigger={0} />);

  rerender(<Confetti trigger={1} />);

  expect(container.querySelector("[data-confetti]")).toBeNull();
});
