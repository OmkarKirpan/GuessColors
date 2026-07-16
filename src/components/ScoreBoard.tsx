import { motion } from "motion/react";
import { useEffect, useRef } from "react";

type ScoreBoardProps = {
  score: number;
  streak: number;
  highScore: number;
  bestStreak: number;
  comboMultiplier: number;
};

const chipSpring = { type: "spring", stiffness: 500, damping: 20 } as const;

const baseChip =
  "rounded-full px-3 py-1.5 text-center text-sm font-bold whitespace-nowrap";

export function ScoreBoard({
  score,
  streak,
  highScore,
  bestStreak,
  comboMultiplier,
}: ScoreBoardProps) {
  const previousHighScore = useRef(highScore);
  const previousBestStreak = useRef(bestStreak);
  const beatHighScore = highScore > previousHighScore.current;
  const beatBestStreak = bestStreak > previousBestStreak.current;

  useEffect(() => {
    previousHighScore.current = highScore;
    previousBestStreak.current = bestStreak;
  }, [highScore, bestStreak]);

  const isStreakMilestone = streak > 0 && streak % 5 === 0;

  return (
    <div className="grid w-full grid-cols-2 gap-2">
      <motion.span
        key={`score-${score}`}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={chipSpring}
        className={`${baseChip} bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200`}
      >
        Score: {score}
      </motion.span>
      <motion.span
        key={`streak-${streak}`}
        initial={{ scale: isStreakMilestone ? 1.5 : 1.3 }}
        animate={{ scale: 1 }}
        transition={chipSpring}
        className={`${baseChip} ${
          isStreakMilestone
            ? "bg-amber-200 text-amber-950 dark:bg-amber-400 dark:text-amber-950"
            : "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200"
        }`}
      >
        Streak: {streak}
        {isStreakMilestone && <span aria-hidden="true"> 🔥</span>}
      </motion.span>
      <motion.span
        key={`best-score-${highScore}`}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={chipSpring}
        className={`${baseChip} ${
          beatHighScore
            ? "bg-amber-200 text-amber-950 dark:bg-amber-400 dark:text-amber-950"
            : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
        }`}
      >
        Best Score: {highScore}
      </motion.span>
      <motion.span
        key={`best-streak-${bestStreak}`}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={chipSpring}
        className={`${baseChip} ${
          beatBestStreak
            ? "bg-amber-200 text-amber-950 dark:bg-amber-400 dark:text-amber-950"
            : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
        }`}
      >
        Best Streak: {bestStreak}
      </motion.span>
      {comboMultiplier > 1 && (
        <motion.span
          key={`combo-${comboMultiplier}`}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          transition={chipSpring}
          className={`${baseChip} col-span-2 bg-fuchsia-200 text-fuchsia-950 dark:bg-fuchsia-500 dark:text-fuchsia-950`}
        >
          Combo ×{comboMultiplier}
          <span aria-hidden="true"> 🔥</span>
        </motion.span>
      )}
    </div>
  );
}
