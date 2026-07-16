import { expect, test } from "@playwright/test";
import { findAnswerButtons, gotoHome } from "./utils";

test("renders a color swatch and three answer buttons", async ({ page }) => {
  await gotoHome(page);

  await expect(page.getByTestId("guess-me")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /^#[0-9A-F]{6}$/ }),
  ).toHaveCount(3);
});

test("clicking the correct answer shows the result and starts a new round", async ({
  page,
}) => {
  await gotoHome(page);

  const swatch = page.getByTestId("guess-me");
  const initialBackground = await swatch.evaluate(
    (el) => getComputedStyle(el).backgroundColor,
  );
  const { correct } = await findAnswerButtons(page);

  await correct.click();

  await expect(page.getByText("Correct!")).toBeVisible();
  await expect(swatch).not.toHaveCSS("background-color", initialBackground);
});

test("clicking a wrong answer keeps the round going and can recover", async ({
  page,
}) => {
  await gotoHome(page);

  const { correct, wrong } = await findAnswerButtons(page);

  await wrong.click();

  await expect(page.getByText("Wrong Answer")).toBeVisible();
  await expect(correct).toBeVisible();

  await correct.click();

  await expect(page.getByText("Correct!")).toBeVisible();
});

test("tracks score and streak across correct and wrong answers", async ({
  page,
}) => {
  await gotoHome(page);

  await expect(page.getByText("Score: 0", { exact: true })).toBeVisible();
  await expect(page.getByText("Streak: 0", { exact: true })).toBeVisible();

  const round1 = await findAnswerButtons(page);
  await round1.correct.click();

  await expect(page.getByText("Score: 1", { exact: true })).toBeVisible();
  await expect(page.getByText("Streak: 1", { exact: true })).toBeVisible();

  // The swatch's background-color transitions over 0.3s; let it settle
  // before re-deriving the correct/wrong buttons from its rendered color.
  await page.waitForTimeout(350);

  const round2 = await findAnswerButtons(page);
  await round2.wrong.click();

  await expect(page.getByText("Score: 1", { exact: true })).toBeVisible();
  await expect(page.getByText("Streak: 0", { exact: true })).toBeVisible();
});
