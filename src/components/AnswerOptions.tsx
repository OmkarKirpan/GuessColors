import { motion } from "motion/react";

type AnswerOptionsProps = {
  answers: string[];
  onSelect: (answer: string) => void;
};

const buttonSpring = { type: "spring", stiffness: 500, damping: 25 } as const;

export function AnswerOptions({ answers, onSelect }: AnswerOptionsProps) {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row">
      {answers.map((answer, index) => (
        <motion.button
          type="button"
          onClick={() => onSelect(answer)}
          key={answer}
          aria-keyshortcuts={String(index + 1)}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          transition={buttonSpring}
          className="flex-1 cursor-pointer rounded-2xl border-b-4 border-violet-300 bg-violet-100 px-4 py-3 font-bold tracking-wide text-slate-900 shadow-sm outline-none focus-visible:ring-4 focus-visible:ring-violet-500 dark:border-violet-950 dark:bg-slate-700 dark:text-slate-100 dark:focus-visible:ring-violet-400"
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
      ))}
    </div>
  );
}
