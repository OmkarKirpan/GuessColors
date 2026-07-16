import { render } from "@testing-library/react";
import { ErrorBoundary } from "../components/ErrorBoundary";

function Bomb() {
  throw new Error("boom");
}

afterEach(() => {
  vi.restoreAllMocks();
});

test("renders children when there is no error", () => {
  const { getByText } = render(
    <ErrorBoundary>
      <div>safe content</div>
    </ErrorBoundary>,
  );

  expect(getByText("safe content")).toBeInTheDocument();
});

test("renders a fallback message when a child throws", () => {
  vi.spyOn(console, "error").mockImplementation(() => {});

  const { getByRole } = render(
    <ErrorBoundary>
      <Bomb />
    </ErrorBoundary>,
  );

  expect(getByRole("alert")).toBeInTheDocument();
});
