import { generateRandomColor } from "../utils/color";

afterEach(() => {
  jest.restoreAllMocks();
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
