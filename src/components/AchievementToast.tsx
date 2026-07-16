import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { EarnedAchievement } from "../hooks/useGuessColorsGame";

type AchievementToastProps = {
  achievement: EarnedAchievement | null;
};

// A transient toast announcing a newly unlocked badge. Auto-dismisses; the
// live region announces it to screen readers.
export function AchievementToast({ achievement }: AchievementToastProps) {
  const [current, setCurrent] = useState<EarnedAchievement | null>(null);

  useEffect(() => {
    if (!achievement) return;
    setCurrent(achievement);
    const timeout = setTimeout(() => setCurrent(null), 3200);
    return () => clearTimeout(timeout);
  }, [achievement]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center px-4"
    >
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.nonce}
            initial={{ y: 40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 26 }}
            className="flex items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-2xl ring-1 ring-white/10 dark:bg-slate-100 dark:text-slate-900"
          >
            <span aria-hidden="true" className="text-2xl">
              {current.emoji}
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-xs font-semibold tracking-wide uppercase opacity-70">
                Achievement unlocked
              </span>
              <span className="font-extrabold">{current.label}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
