import { motion } from "motion/react";
import { ACHIEVEMENTS } from "../utils/achievements";

type AchievementsBarProps = {
  unlocked: string[];
};

// A persistent row of every badge, dimmed while locked and lit once earned, so
// players can see their collection and what's left — not just the fleeting
// unlock toast. State is conveyed via aria-label, not color alone.
export function AchievementsBar({ unlocked }: AchievementsBarProps) {
  const owned = new Set(unlocked);

  return (
    <section aria-label="Achievements" className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
        <span>Achievements</span>
        <span>
          {owned.size} / {ACHIEVEMENTS.length}
        </span>
      </div>
      <ul className="flex flex-wrap justify-center gap-2">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = owned.has(achievement.id);
          return (
            <li key={achievement.id}>
              <motion.span
                role="img"
                data-unlocked={isUnlocked}
                title={`${achievement.label} — ${achievement.description}${
                  isUnlocked ? "" : " (locked)"
                }`}
                aria-label={`${achievement.label}, ${
                  isUnlocked ? "unlocked" : "locked"
                }`}
                initial={false}
                animate={{ scale: isUnlocked ? 1 : 0.92 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className={`grid size-9 place-items-center rounded-full text-lg ring-1 ${
                  isUnlocked
                    ? "bg-amber-100 ring-amber-400 dark:bg-amber-500/25 dark:ring-amber-400/70"
                    : "bg-slate-100 opacity-40 ring-slate-300 grayscale dark:bg-slate-700 dark:ring-slate-600"
                }`}
              >
                <span aria-hidden="true">{achievement.emoji}</span>
              </motion.span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
