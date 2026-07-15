import { render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import App from "../App";

afterEach(() => {
  jest.restoreAllMocks();
  document.body.classList.remove("darkmode");
});

// Queues exact Math.random values for the calls a test cares about (e.g. the
// three colors of a round), then falls back to a cycling, non-repeating
// sequence for any further calls (shuffle comparisons, extra rounds, retries
// inside the unique-color loop). A constant fallback would risk an infinite
// loop there, since every draw would collide with the one before it.
function mockRandomSequence(...values) {
  const cyclingDefaults = [0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95];
  let cycleIndex = 0;
  const spy = jest.spyOn(Math, "random");
  values.forEach((value) => spy.mockReturnValueOnce(value));
  spy.mockImplementation(() => {
    const value = cyclingDefaults[cycleIndex % cyclingDefaults.length];
    cycleIndex += 1;
    return value;
  });
  return spy;
}

test("renders without crashing", () => {
  render(<App />);
});

test("generates initial color", () => {
  const { getByTestId } = render(<App />);
  const guessMeElement = getByTestId("guess-me");
  expect(guessMeElement).toBeInTheDocument();
});

test("checks for correct answer", () => {
  mockRandomSequence(
    0.1, // actual color -> #199999
    0.5, // distractor -> #7fffff
    0.9 // distractor -> #e66665
  );

  const { getByText, queryByText } = render(<App />);

  fireEvent.click(getByText("#199999"));

  expect(queryByText("Correct!")).toBeInTheDocument();
});

test("checks for wrong answer", () => {
  mockRandomSequence(
    0.1, // actual color -> #199999
    0.5, // distractor -> #7fffff
    0.9 // distractor -> #e66665
  );

  const { getByText, queryByText } = render(<App />);

  fireEvent.click(getByText("#7FFFFF"));

  expect(queryByText("Wrong Answer")).toBeInTheDocument();
});

test("toggles dark mode on and off via the theme button", () => {
  const { getByText } = render(<App />);

  expect(document.body.classList.contains("darkmode")).toBe(false);

  fireEvent.click(getByText("Change Theme"));
  expect(document.body.classList.contains("darkmode")).toBe(true);

  fireEvent.click(getByText("Change Theme"));
  expect(document.body.classList.contains("darkmode")).toBe(false);
});

test("does not render duplicate answer colors when random draws collide", () => {
  mockRandomSequence(
    0.1, // actual -> #199999
    0.1, // candidate collides with actual, rejected
    0.5, // distractor -> #7fffff
    0.5, // candidate collides with the distractor above, rejected
    0.9 // distractor -> #e66665
  );

  const { getAllByText } = render(<App />);

  const answerButtons = getAllByText(/^#[0-9A-F]{6}$/);
  const labels = answerButtons.map((button) => button.textContent);

  expect(labels).toHaveLength(3);
  expect(new Set(labels).size).toBe(3);
});

test("starts a new round immediately after a correct answer", () => {
  mockRandomSequence(
    0.1, // round 1 actual -> #199999
    0.5, // round 1 distractor -> #7fffff
    0.9 // round 1 distractor -> #e66665
  );

  const { getByText, queryByText, getByTestId } = render(<App />);
  const initialBackground = getByTestId("guess-me").style.background;

  fireEvent.click(getByText("#199999"));

  expect(queryByText("Correct!")).toBeInTheDocument();
  expect(getByTestId("guess-me").style.background).not.toBe(
    initialBackground
  );
});

test("keeps the same round after a wrong answer, and can recover on the next guess", () => {
  mockRandomSequence(
    0.1, // actual -> #199999
    0.5, // distractor -> #7fffff
    0.9 // distractor -> #e66665
  );

  const { getByText, queryByText, getByTestId } = render(<App />);
  const backgroundBeforeWrongGuess = getByTestId("guess-me").style.background;

  fireEvent.click(getByText("#7FFFFF"));

  expect(queryByText("Wrong Answer")).toBeInTheDocument();
  expect(getByTestId("guess-me").style.background).toBe(
    backgroundBeforeWrongGuess
  );
  expect(getByText("#199999")).toBeInTheDocument();

  fireEvent.click(getByText("#199999"));

  expect(queryByText("Correct!")).toBeInTheDocument();
});
