# Changelog

All notable changes to this project are documented here. This project doesn't
follow versioned releases, so entries are grouped by date instead of version
number, most recent first.

## [Unreleased]

### Added

- A playful visual redesign built on Tailwind CSS v4: gradient page background,
  centered game card, pill-style score chips, chunky answer buttons with
  visible 1/2/3 key hints, a bundled Nunito font, and a glow on the swatch
  derived from its current color. Dark mode restyled to match.
- Springy animations via the `motion` library: score chips pop when they
  change, best-score/best-streak chips flash amber when a record is beaten,
  the streak chip celebrates every 5-streak milestone with a 🔥, the result
  message pops in, and buttons respond to hover/press. All motion respects
  `prefers-reduced-motion`.

- End-to-end tests (Playwright) and automated accessibility scans (axe-core)
  covering the game flow, theme toggle, and initial/dark-mode/result states,
  wired into CI as a new `e2e` job alongside the existing unit test job.
- Biome for linting and formatting, enforced in CI via a new `lint` step.
- An `ErrorBoundary` around `<App />` so a rendering error shows a fallback
  message instead of a blank page.
- Score and streak tracking (`ScoreBoard`), with the all-time high score and
  best streak persisted in `localStorage` (`src/utils/stats.ts`) so they
  survive page reloads — the running score/streak reset each session.
- Keyboard play: press 1, 2, or 3 to pick the corresponding answer button.
- A smooth color transition on the swatch when a new round starts, and a
  shake effect on a wrong answer, both disabled under
  `prefers-reduced-motion`.

### Changed

- Replaced the hand-written CSS (`src/App.css`) with Tailwind utility classes;
  `src/index.css` is now the single stylesheet entry, and the shake animation
  moved from CSS keyframes to a `motion`-driven spring that exposes its
  lifecycle via a `data-shaking` attribute (the animation e2e tests assert
  that instead of CSS `animation-name`).
- Upgraded TypeScript to 5.x with `moduleResolution: "bundler"` (required by
  `motion` and `@tailwindcss/vite`).
- Updated the README to reflect the current tooling and `src/` project
  structure.

### Fixed

- `generateRandomColor()` (`src/utils/color.ts`) now generates colors in HSL
  with clamped saturation (65–90%) and lightness (45–60%), so a swatch can no
  longer be near-white, near-black, or gray and blend into the page background
  in either theme.
- Added a `<main>` landmark and a level-one heading to the page, and made the
  result message an announced live region (`role="status"`) and the theme
  toggle button reflect its pressed state (`aria-pressed`) — all surfaced by
  the new automated accessibility scans.
- Removed leftover debug `console.log` calls in `useGuessColorsGame`.

## 2026-07-16

### Added

- Migrated the test suite to Vitest, running natively on the existing Vite
  config, replacing `react-scripts` (CRA/webpack/Babel/Jest).
- Enforced a 90% test coverage threshold in CI.

### Changed

- Refactored game logic out of `App.tsx` into a `useGuessColorsGame` hook,
  and extracted `ColorSwatch`, `AnswerOptions`, `ResultMessage`, and
  `ThemeToggle` as reusable components.
- Standardized on pnpm as the package manager (removed `package-lock.json`).
- Bumped the CI Node.js matrix from 14.x/16.x/18.x to the currently
  maintained 22.x and 24.x.

### Fixed

- Duplicate answer colors: the color-guessing round could draw the same
  color twice, rendering two buttons with identical labels.
- Random color generation could produce fewer than 6 hex digits (e.g. `#a7`
  instead of `#0000a7`), mismatching the color box against its button label.
- The Deploy workflow failed on every push to `main` because it referenced
  the deprecated `actions/upload-artifact@v3` / `actions/download-artifact@v3`.
- The CI build step crashed under pnpm because of the npm-only
  `--if-present` flag, which pnpm forwards through to the script instead of
  handling itself.

## 2023-10-22

### Added

- A GitHub Actions CI workflow to run the test suite automatically on
  pushes and pull requests.
- Additional test cases contributed by the community.

## 2023-10

### Changed

- Several README documentation passes (setup instructions, gameplay
  description).

## 2023-03-06

### Added

- Initial project setup: a color-guessing game built with React and Vite,
  deployed to GitHub Pages.
