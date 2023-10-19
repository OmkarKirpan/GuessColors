import { render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import App, { generateRandomColor } from "../App";

// Helper function to convert RGB to Hex
function rgbToHex(rgb) {
  // Choose correct separator
  let sep = rgb.indexOf(",") > -1 ? "," : " ";
  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb.substr(4).split(")")[0].split(sep);

  let r = (+rgb[0]).toString(16),
    g = (+rgb[1]).toString(16),
    b = (+rgb[2]).toString(16);

  if (r.length === 1) r = "0" + r;
  if (g.length === 1) g = "0" + g;
  if (b.length === 1) b = "0" + b;

  return "#" + r + g + b;
}

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

test("checks for correct answer", () => {
  const { getByTestId, getByText, queryByText } = render(<App />);
  const guessMe = getByTestId("guess-me");
  const color = guessMe.style.background;

  // Convert color to hex
  const hexColor = rgbToHex(color);

  fireEvent.click(getByText(hexColor.toUpperCase()));

  expect(queryByText("Correct!")).toBeInTheDocument();
});

test("checks for wrong answer", () => {
  const { getByTestId, getByText, queryByText, getAllByRole} = render(<App />);
  const guessMe = getByTestId("guess-me");
  const color = guessMe.style.background;
  const answers = getAllByRole('button')
  const incorrectAnswer = Array.from(answers).find(
    (ans) => ans.innerHTML.toUpperCase() !== rgbToHex(color).toUpperCase()
  );
  
  fireEvent.click(getByText(incorrectAnswer.innerHTML));

  expect(queryByText("Wrong Answer")).toBeInTheDocument();
});

