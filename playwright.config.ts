import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const BASE_PATH = "/GuessColors/"; // must match vite.config.ts's `base`
const baseURL = `http://localhost:${PORT}${BASE_PATH}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "html",
  timeout: 30_000,
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm run build && pnpm run preview",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
