import type { Locator, Page } from "@playwright/test";

// The app is served under Vite's `/GuessColors/` base path. page.goto("/")
// resolves to the bare origin root and 404s — always navigate with this
// helper (or "./") instead of a leading-slash path.
export async function gotoHome(page: Page) {
  await page.goto("./");
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

async function getSwatchRgb(page: Page): Promise<[number, number, number]> {
  const rgbString = await page
    .getByTestId("guess-me")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  const [r, g, b] = (rgbString.match(/\d+/g) ?? []).map(Number);
  return [r, g, b];
}

// Determines which answer button matches the swatch's actual rendered color
// (the correct answer) vs. one that doesn't (a wrong answer), by reading the
// real DOM state rather than pre-seeding Math.random. A naive RNG mock isn't
// reliable here: the production bundle re-evaluates react-dom's own
// module-level Math.random() calls (used internally for React's fiber
// property key suffixes) on every fresh page load, consuming values ahead of
// the app's own hook in a way a plain queued mock doesn't account for.
export async function findAnswerButtons(page: Page): Promise<{
  correct: Locator;
  wrong: Locator;
  correctIndex: number;
  wrongIndex: number;
}> {
  const buttons = page.getByRole("button", { name: /^#[0-9A-F]{6}$/ });
  const swatchRgb = await getSwatchRgb(page);

  const count = await buttons.count();
  let correct: Locator | undefined;
  let wrong: Locator | undefined;
  let correctIndex: number | undefined;
  let wrongIndex: number | undefined;

  for (let i = 0; i < count; i++) {
    const button = buttons.nth(i);
    const text = await button.textContent();
    const rgb = hexToRgb(text ?? "");
    const isMatch = rgb.every((value, index) => value === swatchRgb[index]);
    if (isMatch) {
      correct = button;
      correctIndex = i;
    } else if (!wrong) {
      wrong = button;
      wrongIndex = i;
    }
  }

  if (
    !correct ||
    !wrong ||
    correctIndex === undefined ||
    wrongIndex === undefined
  ) {
    throw new Error("Could not determine correct/wrong answer buttons");
  }

  return { correct, wrong, correctIndex, wrongIndex };
}
