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

test("flashes the clicked button on a wrong answer", async ({ page }) => {
  await gotoHome(page);

  const { wrong } = await findAnswerButtons(page);
  await wrong.click();

  // The wrong option stays highlighted (the round continues) via data-flash.
  await expect(wrong).toHaveAttribute("data-flash", "wrong");
});

test("awards XP and advances the level progress bar on a correct answer", async ({
  page,
}) => {
  await gotoHome(page);

  const bar = page.getByRole("progressbar");
  await expect(bar).toHaveAttribute("aria-valuenow", "0");

  const { correct } = await findAnswerButtons(page);
  await correct.click();

  // A correct answer awards BASE_POINTS (10) at the 1x combo.
  await expect(bar).toHaveAttribute("aria-valuenow", "10");
});

test("bursts confetti on a correct answer, but never under reduced motion", async ({
  page,
}) => {
  await gotoHome(page);

  const { correct } = await findAnswerButtons(page);
  await correct.click();

  // The confetti layer is present and flips to active for the burst.
  await expect(page.locator("[data-confetti]")).toHaveAttribute(
    "data-confetti",
    "active",
  );
});

test("renders no confetti layer under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoHome(page);

  const { correct } = await findAnswerButtons(page);
  await correct.click();

  await expect(page.getByText("Correct!")).toBeVisible();
  await expect(page.locator("[data-confetti]")).toHaveCount(0);
});

test("mutes and persists the sound preference", async ({ page }) => {
  await gotoHome(page);

  const muteButton = page.getByRole("button", { name: "Mute sounds" });
  await expect(muteButton).toHaveAttribute("aria-pressed", "false");

  await muteButton.click();
  await expect(
    page.getByRole("button", { name: "Unmute sounds" }),
  ).toHaveAttribute("aria-pressed", "true");

  await page.reload();

  await expect(
    page.getByRole("button", { name: "Unmute sounds" }),
  ).toHaveAttribute("aria-pressed", "true");
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
