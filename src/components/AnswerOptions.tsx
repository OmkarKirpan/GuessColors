import { motion } from "motion/react";
import type { LastAnswer } from "../hooks/useGuessColorsGame";

type AnswerOptionsProps = {
  answers: string[];
  lastAnswer: LastAnswer | null;
  onSelect: (answer: string) => void;
};

const buttonSpring = { type: "spring", stiffness: 500, damping: 25 } as const;

const baseButton =
  "flex-1 cursor-pointer rounded-2xl border-b-4 px-4 py-3 font-bold tracking-wide shadow-sm outline-none focus-visible:ring-4";

const idleButton =
  "border-violet-300 bg-violet-100 text-slate-900 focus-visible:ring-violet-500 dark:border-violet-950 dark:bg-slate-700 dark:text-slate-100 dark:focus-visible:ring-violet-400";

const wrongButton =
  "border-rose-500 bg-rose-200 text-rose-950 focus-visible:ring-rose-500 dark:border-rose-400 dark:bg-rose-500 dark:text-rose-950";

export function AnswerOptions({
  answers,
  lastAnswer,
  onSelect,
}: AnswerOptionsProps) {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row">
      {answers.map((answer, index) => {
        // A correct answer immediately regenerates the round (new buttons), so
        // only a wrong answer's button lingers to be flashed — the correct cue
        // lives on the persistent swatch (see SuccessPulse) instead.
        const flashWrong = lastAnswer?.answer === answer && !lastAnswer.correct;

        return (
          <motion.button
            type="button"
            onClick={() => onSelect(answer)}
            key={answer}
            aria-keyshortcuts={String(index + 1)}
            data-flash={flashWrong ? "wrong" : "none"}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.92 }}
            animate={flashWrong ? { scale: [1, 0.97, 1] } : { scale: 1 }}
            transition={buttonSpring}
            className={`${baseButton} ${flashWrong ? wrongButton : idleButton}`}
          >
            {/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: the <kbd> hint is decorative and not focusable; hiding it keeps the button's accessible name exactly the hex label */}
            <kbd
              aria-hidden="true"
              className="mr-2 rounded-md bg-white/80 px-1.5 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-900/60 dark:text-slate-400"
            >
              {index + 1}
            </kbd>
            {answer.toUpperCase()}
          </motion.button>
        );
      })}
    </div>
  );
}
