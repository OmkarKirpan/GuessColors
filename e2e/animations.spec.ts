import { expect, test } from "@playwright/test";
import { findAnswerButtons, gotoHome } from "./utils";

test("applies a shake animation to the swatch on a wrong answer", async ({
  page,
}) => {
  await gotoHome(page);

  const { wrong } = await findAnswerButtons(page);
  await wrong.click();

  const swatch = page.getByTestId("guess-me");
  await expect(swatch).toHaveClass(/shake/);
  await expect(swatch).toHaveCSS("animation-name", "shake");
});

test("disables the shake animation under prefers-reduced-motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoHome(page);

  const { wrong } = await findAnswerButtons(page);
  await wrong.click();

  const swatch = page.getByTestId("guess-me");
  await expect(swatch).toHaveCSS("animation-name", "none");
});

test("persists best score and streak across a reload, resetting the session totals", async ({
  page,
}) => {
  await gotoHome(page);

  const { correct } = await findAnswerButtons(page);
  await correct.click();

  await expect(page.getByText("Best Score: 1", { exact: true })).toBeVisible();
  await expect(page.getByText("Best Streak: 1", { exact: true })).toBeVisible();

  await page.reload();

  await expect(page.getByText("Score: 0", { exact: true })).toBeVisible();
  await expect(page.getByText("Streak: 0", { exact: true })).toBeVisible();
  await expect(page.getByText("Best Score: 1", { exact: true })).toBeVisible();
  await expect(page.getByText("Best Streak: 1", { exact: true })).toBeVisible();
});
