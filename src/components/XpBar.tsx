import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import type { LevelProgress } from "../utils/levels";

type XpBarProps = {
  progress: LevelProgress;
  levelUpTrigger: number;
};

// The level + XP progress bar. The fill springs toward the current ratio, and
// the whole bar gives a quick pop when the player levels up.
export function XpBar({ progress, levelUpTrigger }: XpBarProps) {
  const controls = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();
  const percent = Math.round(progress.ratio * 100);

  useEffect(() => {
    if (levelUpTrigger === 0 || prefersReducedMotion) return;
    controls.start({
      scale: [1, 1.06, 1],
      transition: { duration: 0.4, ease: "easeInOut" },
    });
  }, [levelUpTrigger, prefersReducedMotion, controls]);

  return (
    <motion.div animate={controls} className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
        <motion.span
          key={`level-${progress.level}`}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          Level {progress.level}
        </motion.span>
        <span>
          {progress.into} / {progress.needed} XP
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`Level ${progress.level} progress`}
        aria-valuemin={0}
        aria-valuemax={progress.needed}
        aria-valuenow={progress.into}
        className="h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
      >
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
      </div>
    </motion.div>
  );
}
