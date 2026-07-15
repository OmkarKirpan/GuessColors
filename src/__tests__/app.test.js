import { render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import App, { generateRandomColor } from "../App";

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders without crashing", () => {
  render(<App />);
});

test("generates initial color", () => {
  const { getByTestId } = render(<App />);
  const guessMeElement = getByTestId("guess-me");
  expect(guessMeElement).toBeInTheDocument();
});

test("generates a random color", () => {
  const color = generateRandomColor();
  expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
});

test("pads short hex values to a full 6-digit color", () => {
  // A small random draw used to produce fewer than 6 hex digits (e.g. "#a7"
  // instead of "#0000a7"), mismatching the color box against its button label.
  jest.spyOn(Math, "random").mockReturnValue(0.00001);

  const color = generateRandomColor();

  expect(color).toBe("#0000a7");
});

test("checks for correct answer", () => {
  jest
    .spyOn(Math, "random")
    .mockReturnValueOnce(0.1) // actual color -> #199999
    .mockReturnValueOnce(0.5) // distractor -> #7fffff
    .mockReturnValueOnce(0.9) // distractor -> #e66665
    .mockReturnValue(0.5); // makes the shuffle comparator a no-op

  const { getByText, queryByText } = render(<App />);

  fireEvent.click(getByText("#199999"));

  expect(queryByText("Correct!")).toBeInTheDocument();
});

test("checks for wrong answer", () => {
  jest
    .spyOn(Math, "random")
    .mockReturnValueOnce(0.1) // actual color -> #199999
    .mockReturnValueOnce(0.5) // distractor -> #7fffff
    .mockReturnValueOnce(0.9) // distractor -> #e66665
    .mockReturnValue(0.5); // makes the shuffle comparator a no-op

  const { getByText, queryByText } = render(<App />);

  fireEvent.click(getByText("#7FFFFF"));

  expect(queryByText("Wrong Answer")).toBeInTheDocument();
});
