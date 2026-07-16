import { MotionConfig } from "motion/react";
import { AchievementsBar } from "./components/AchievementsBar";
import { AchievementToast } from "./components/AchievementToast";
import { AnswerOptions } from "./components/AnswerOptions";
import { ColorSwatch } from "./components/ColorSwatch";
import { Confetti } from "./components/Confetti";
import { FloatingScore } from "./components/FloatingScore";
import { ResultMessage } from "./components/ResultMessage";
import { ScoreBoard } from "./components/ScoreBoard";
import { SoundToggle } from "./components/SoundToggle";
import { SuccessPulse } from "./components/SuccessPulse";
import { ThemeToggle } from "./components/ThemeToggle";
import { XpBar } from "./components/XpBar";
import { useGuessColorsGame } from "./hooks/useGuessColorsGame";

function App() {
  const {
    color,
    answers,
    result,
    score,
    streak,
    comboMultiplier,
    levelProgress,
    highScore,
    bestStreak,
    shakeTrigger,
    confettiTrigger,
    levelUpTrigger,
    pointsAwarded,
    lastAnswer,
    earnedAchievement,
    unlockedAchievements,
    handleAnswerClicked,
  } = useGuessColorsGame();

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-full items-center justify-center bg-linear-to-br from-violet-200 via-sky-100 to-amber-100 p-4 font-sans text-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900 dark:text-slate-100">
        <ThemeToggle />
        <SoundToggle />
        <main className="relative flex w-full max-w-md flex-col items-center gap-5 rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5 sm:p-8 dark:bg-slate-800 dark:ring-white/10">
          <Confetti trigger={confettiTrigger} />
          <h1 className="text-3xl font-extrabold tracking-tight">
            Guess Colors
          </h1>
          <XpBar progress={levelProgress} levelUpTrigger={levelUpTrigger} />
          <ScoreBoard
            score={score}
            streak={streak}
            highScore={highScore}
            bestStreak={bestStreak}
            comboMultiplier={comboMultiplier}
          />
          <div className="relative w-full">
            <ColorSwatch color={color} shakeTrigger={shakeTrigger} />
            <SuccessPulse trigger={pointsAwarded?.id ?? 0} />
            <FloatingScore points={pointsAwarded} />
          </div>
          <AnswerOptions
            answers={answers}
            lastAnswer={lastAnswer}
            onSelect={handleAnswerClicked}
          />
          <ResultMessage result={result} />
          <AchievementsBar unlocked={unlockedAchievements} />
        </main>
        <AchievementToast achievement={earnedAchievement} />
      </div>
    </MotionConfig>
  );
}

export default App;
