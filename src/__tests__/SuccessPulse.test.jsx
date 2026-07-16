import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SuccessPulse } from "../components/SuccessPulse";
import { setPrefersReducedMotion } from "../test/setup";

test("stays idle before any trigger", () => {
  const { container } = render(<SuccessPulse trigger={0} />);
  const root = container.querySelector("[data-success-pulse]");
  expect(root).toHaveAttribute("data-success-pulse", "idle");
});

test("flashes when the trigger increments", () => {
  const { container, rerender } = render(<SuccessPulse trigger={0} />);

  rerender(<SuccessPulse trigger={1} />);

  const root = container.querySelector("[data-success-pulse]");
  expect(root).toHaveAttribute("data-success-pulse", "active");
});

test("renders nothing under reduced motion", () => {
  setPrefersReducedMotion(true);
  const { container, rerender } = render(<SuccessPulse trigger={0} />);

  rerender(<SuccessPulse trigger={1} />);

  expect(container.querySelector("[data-success-pulse]")).toBeNull();
});
