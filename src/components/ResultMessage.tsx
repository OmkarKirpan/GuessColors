import { motion } from "motion/react";
import { Result } from "../types";

type ResultMessageProps = {
  result: Result | undefined;
};

export function ResultMessage({ result }: ResultMessageProps) {
  return (
    <div role="status" className="flex h-8 items-center justify-center">
      {result !== undefined && (
        <motion.div
          key={result}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className={
            result === Result.Correct
              ? "text-xl font-extrabold text-green-700 dark:text-green-400"
              : "text-xl font-extrabold text-rose-600 dark:text-rose-400"
          }
        >
          {result === Result.Correct ? "Correct!" : "Wrong Answer"}
        </motion.div>
      )}
    </div>
  );
}
