import { shuffleArray } from "../utils/array";

afterEach(() => {
  vi.restoreAllMocks();
});

test("returns a permutation containing the same elements", () => {
  const input = [1, 2, 3, 4, 5];

  const result = shuffleArray(input);

  expect(result).toHaveLength(input.length);
  expect([...result].sort()).toEqual([...input].sort());
});

test("does not mutate the input array", () => {
  const input = [1, 2, 3];
  const copy = [...input];

  shuffleArray(input);

  expect(input).toEqual(copy);
});

test("returns a new array instance, not the same reference", () => {
  const input = [1, 2, 3];

  const result = shuffleArray(input);

  expect(result).not.toBe(input);
});

test("handles an empty array", () => {
  expect(shuffleArray([])).toEqual([]);
});

test("handles a single-element array", () => {
  expect(shuffleArray(["only"])).toEqual(["only"]);
});

test("performs a Fisher-Yates shuffle driven by Math.random", () => {
  // Every draw resolves to index 0 for the shrinking prefix being shuffled,
  // so each pass swaps the current last element to the front.
  vi.spyOn(Math, "random").mockReturnValue(0);

  const result = shuffleArray([1, 2, 3, 4]);

  expect(result).toEqual([2, 3, 4, 1]);
});

test("leaves order unchanged when Math.random always picks the last index", () => {
  // A draw just under 1 always resolves to the highest index still in play,
  // i.e. the element's current position, so no swap ever happens.
  vi.spyOn(Math, "random").mockReturnValue(0.9999);

  const result = shuffleArray([1, 2, 3, 4]);

  expect(result).toEqual([1, 2, 3, 4]);
});
