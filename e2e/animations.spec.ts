import { expect, test } from "@playwright/test";
import { findAnswerButtons, gotoHome } from "./utils";

test("shakes the swatch on a wrong answer", async ({ page }) => {
  await gotoHome(page);

  const { wrong } = await findAnswerButtons(page);
  await wrong.click();

  // The motion-driven shake exposes its lifecycle through data-shaking:
  // flipped on when the animation starts and back off when it completes.
  const swatch = page.getByTestId("guess-me");
  await expect(swatch).toHaveAttribute("data-shaking", "true");
  await expect(swatch).toHaveAttribute("data-shaking", "false");
});

test("does not shake under prefers-reduced-motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoHome(page);

  const { wrong } = await findAnswerButtons(page);
  await wrong.click();

  // Wait for the wrong answer to register before asserting the shake never
  // started: no data-shaking flip and no transform written to the element.
  await expect(page.getByText("Wrong Answer")).toBeVisible();

  const swatch = page.getByTestId("guess-me");
  await expect(swatch).toHaveAttribute("data-shaking", "false");
  await expect(swatch).toHaveCSS("transform", "none");
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
