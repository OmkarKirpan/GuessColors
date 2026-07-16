# Guess the Colors Game [![Node.js CI](https://github.com/OmkarKirpan/GuessColors/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/OmkarKirpan/GuessColors/actions/workflows/node.js.yml)

This is a simple color guessing game built with React.js and Vite.js. The game is deployed on GitHub Pages and can be played [here](https://omkarkirpan.github.io/GuessColors/).

## 🕹️How to Play

- You will be presented with a colored box.
- Three color options will be displayed as buttons.
- Click on the button that corresponds to the color of the box.
- If you select the correct color, you will see a "Correct!" message.
- If you select the wrong color, you will see a "Wrong Answer" message.
- You can also press 1, 2, or 3 on your keyboard to pick the corresponding
  answer button.
- Your score and streak are tracked as you play, and your best score and
  best streak are saved so they're there next time you visit.
- Keep playing to test your color recognition skills!

## 💻Technologies Used

- React
- TypeScript
- Vite
- Vitest + React Testing Library
- Playwright + axe-core (end-to-end and accessibility testing)
- Biome (linting and formatting)
- pnpm

## 🖥️Development

If you want to run this project locally, you can follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/omkarkirpan/GuessColors.git
   ```
2. Navigate to the project directory:
   ```bash
   cd GuessColors
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Start the development server:
   ```bash
   pnpm run dev
   ```

### Other useful commands

```bash
pnpm run build           # type-check and build for production
pnpm run preview         # preview the production build locally
pnpm test                # run the test suite
pnpm run test:coverage   # run the test suite with a coverage report
pnpm run e2e             # run end-to-end + accessibility tests (Playwright + axe)
pnpm run e2e:ui          # run e2e tests with Playwright's interactive UI
pnpm run lint            # check linting and formatting (Biome)
pnpm run lint:fix        # fix linting and formatting issues in place
pnpm run format          # fix formatting only (no lint rules)
pnpm run format:check    # check formatting only, without fixing
```

## 📂Project Structure

- `src/hooks/useGuessColorsGame.ts` — game state and logic (color generation, answer checking, score/streak, keyboard play)
- `src/components/` — presentational components (`ColorSwatch`, `AnswerOptions`, `ResultMessage`, `ThemeToggle`, `ScoreBoard`)
- `src/utils/color.ts` — random color generation
- `src/utils/stats.ts` — `localStorage` persistence for the all-time high score and best streak
- `src/types.ts` — shared types
- `src/App.tsx` — composes the hook and components together
- `e2e/` — Playwright end-to-end and accessibility (axe-core) tests

## 💻Deployment

The project is automatically deployed to GitHub Pages when changes are pushed to the main branch.

## 📝Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a history of notable changes.

## ✒️Author

This project was created by Omkar Kirpan.

Feel free to contribute or report issues on the [GitHub repository](https://github.com/omkarkirpan/GuessColors).
