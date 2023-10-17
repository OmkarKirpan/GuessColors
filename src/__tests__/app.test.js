import { render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import App from "../App";

test("renders without crashing", () => {
  render(<App />);
});

test("generates initial color", () => {
  const { getByTestId } = render(<App />);
  const guessMeElement = getByTestId("guess-me");
  expect(guessMeElement).toBeInTheDocument();
});

test("displays answer buttons", () => {
  const { getByText } = render(<App />);
  answers.forEach((answer) => {
    const buttonElement = getByText(answer.toUpperCase());
    expect(buttonElement).toBeInTheDocument();
  });
});

test("clicking an answer triggers correct behavior", () => {
  const { getByText } = render(<App />);
  const correctAnswer = answers[0];
  fireEvent.click(getByText(correctAnswer.toUpperCase()));
  const correctElement = getByText("Correct!");
  expect(correctElement).toBeInTheDocument();
});

test("clicking a wrong answer triggers correct behavior", () => {
  const { getByText } = render(<App />);
  const wrongAnswer = answers.find((answer) => answer !== answers[0]);
  fireEvent.click(getByText(wrongAnswer.toUpperCase()));
  const wrongElement = getByText("Wrong Answer");
  expect(wrongElement).toBeInTheDocument();
});

test("color changes after correct answer", () => {
  const { getByTestId } = render(<App />);
  const initialColor = getByTestId("guess-me").style.background;
  const correctAnswer = answers[0];
  fireEvent.click(getByText(correctAnswer.toUpperCase()));
  const newColor = getByTestId("guess-me").style.background;
  expect(newColor).not.toBe(initialColor);
});
