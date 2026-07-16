import { expect, test } from "@playwright/test";
import { gotoHome } from "./utils";

test("toggles dark mode on and off via the theme button", async ({ page }) => {
  await gotoHome(page);

  const themeButton = page.getByRole("button", { name: "Change Theme" });
  const body = page.locator("body");

  await expect(body).not.toHaveClass(/darkmode/);
  await expect(themeButton).toHaveAttribute("aria-pressed", "false");

  await themeButton.click();
  await expect(body).toHaveClass(/darkmode/);
  await expect(themeButton).toHaveAttribute("aria-pressed", "true");

  await themeButton.click();
  await expect(body).not.toHaveClass(/darkmode/);
  await expect(themeButton).toHaveAttribute("aria-pressed", "false");
});
