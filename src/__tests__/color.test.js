import { generateRandomColor } from "../utils/color";

afterEach(() => {
  vi.restoreAllMocks();
});

test("generates a random color", () => {
  const color = generateRandomColor();
  expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
});

test("maps a draw deterministically to a full 6-digit color", () => {
  vi.spyOn(Math, "random").mockReturnValue(0.1);

  const color = generateRandomColor();

  expect(color).toBe("#e09e3b");
});

test("always generates vivid colors visible on light and dark backgrounds", () => {
  for (let i = 0; i < 200; i++) {
    const color = generateRandomColor();
    expect(color).toMatch(/^#[0-9a-f]{6}$/);

    const channels = [1, 3, 5].map((offset) =>
      Number.parseInt(color.slice(offset, offset + 2), 16),
    );
    const max = Math.max(...channels);
    const min = Math.min(...channels);

    // Clamped saturation/lightness guarantee a bright dominant channel
    // (never near-black) and real chroma spread (never near-white or gray).
    expect(max).toBeGreaterThanOrEqual(160);
    expect(max - min).toBeGreaterThanOrEqual(90);
  }
});
