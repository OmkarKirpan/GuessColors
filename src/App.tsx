import { MotionConfig } from "motion/react";
import { AnswerOptions } from "./components/AnswerOptions";
import { ColorSwatch } from "./components/ColorSwatch";
import { ResultMessage } from "./components/ResultMessage";
import { ScoreBoard } from "./components/ScoreBoard";
import { ThemeToggle } from "./components/ThemeToggle";
import { useGuessColorsGame } from "./hooks/useGuessColorsGame";

function App() {
  const {
    color,
    answers,
    result,
    score,
    streak,
    highScore,
    bestStreak,
    shakeTrigger,
    handleAnswerClicked,
  } = useGuessColorsGame();

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-full items-center justify-center bg-linear-to-br from-violet-200 via-sky-100 to-amber-100 p-4 font-sans text-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 dark:text-slate-100">
        <ThemeToggle />
        <main className="flex w-full max-w-md flex-col items-center gap-5 rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5 sm:p-8 dark:bg-slate-800 dark:ring-white/10">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Guess Colors
          </h1>
          <ScoreBoard
            score={score}
            streak={streak}
            highScore={highScore}
            bestStreak={bestStreak}
          />
          <ColorSwatch color={color} shakeTrigger={shakeTrigger} />
          <AnswerOptions answers={answers} onSelect={handleAnswerClicked} />
          <ResultMessage result={result} />
        </main>
      </div>
    </MotionConfig>
  );
}

export default App;
