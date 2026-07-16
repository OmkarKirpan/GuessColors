import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FloatingScore } from "../components/FloatingScore";

test("renders nothing when there are no points", () => {
  const { container } = render(<FloatingScore points={null} />);
  expect(container.textContent).toBe("");
});

test("shows the awarded points with the combo multiplier", () => {
  const { container, rerender } = render(<FloatingScore points={null} />);

  rerender(<FloatingScore points={{ value: 30, multiplier: 3, id: 1 }} />);

  expect(container.textContent).toContain("+30");
  expect(container.textContent).toContain("×3");
});

test("omits the multiplier at 1x", () => {
  const { container, rerender } = render(<FloatingScore points={null} />);

  rerender(<FloatingScore points={{ value: 10, multiplier: 1, id: 2 }} />);

  expect(container.textContent).toContain("+10");
  expect(container.textContent).not.toContain("×");
});
