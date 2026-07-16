import { expect, test } from "@playwright/test";
import { findAnswerButtons, gotoHome } from "./utils";

test("selects the correct answer with its number key", async ({ page }) => {
  await gotoHome(page);

  const { correctIndex } = await findAnswerButtons(page);

  await page.keyboard.press(String(correctIndex + 1));

  await expect(page.getByText("Correct!")).toBeVisible();
});

test("selects a wrong answer with its number key", async ({ page }) => {
  await gotoHome(page);

  const { wrongIndex } = await findAnswerButtons(page);

  await page.keyboard.press(String(wrongIndex + 1));

  await expect(page.getByText("Wrong Answer")).toBeVisible();
});

test("ignores number keys held with a modifier", async ({ page }) => {
  await gotoHome(page);

  const { correctIndex } = await findAnswerButtons(page);

  await page.keyboard.down("Control");
  await page.keyboard.press(String(correctIndex + 1));
  await page.keyboard.up("Control");

  await expect(page.getByText("Correct!")).not.toBeVisible();
  await expect(page.getByText("Wrong Answer")).not.toBeVisible();
});
