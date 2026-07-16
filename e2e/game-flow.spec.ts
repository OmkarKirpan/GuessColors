import { test, expect } from "@playwright/test";
import { gotoHome, findAnswerButtons } from "./utils";

test("renders a color swatch and three answer buttons", async ({ page }) => {
  await gotoHome(page);

  await expect(page.getByTestId("guess-me")).toBeVisible();
  await expect(page.getByRole("button", { name: /^#[0-9A-F]{6}$/ })).toHaveCount(3);
});

test("clicking the correct answer shows the result and starts a new round", async ({
  page,
}) => {
  await gotoHome(page);

  const swatch = page.getByTestId("guess-me");
  const initialBackground = await swatch.evaluate(
    (el) => getComputedStyle(el).backgroundColor
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
