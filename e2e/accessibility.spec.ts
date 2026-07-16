import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { gotoHome, findAnswerButtons } from "./utils";

test("has no detectable accessibility violations on initial load", async ({
  page,
}) => {
  await gotoHome(page);

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test("has no detectable accessibility violations with the result message visible", async ({
  page,
}) => {
  await gotoHome(page);

  const { wrong } = await findAnswerButtons(page);
  await wrong.click();
  await expect(page.getByText("Wrong Answer")).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test("has no detectable accessibility violations in dark mode", async ({
  page,
}) => {
  await gotoHome(page);

  await page.getByRole("button", { name: "Change Theme" }).click();
  await expect(page.locator("body")).toHaveClass(/darkmode/);

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
