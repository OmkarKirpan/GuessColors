import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { PointsAwarded } from "../hooks/useGuessColorsGame";

type FloatingScoreProps = {
  points: PointsAwarded | null;
};

// A "+N" (with the combo multiplier when active) that floats up from the top of
// the swatch and fades on each correct answer.
export function FloatingScore({ points }: FloatingScoreProps) {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState<PointsAwarded | null>(null);

  useEffect(() => {
    if (!points) return;
    setVisible(points);
    const timeout = setTimeout(() => setVisible(null), 900);
    return () => clearTimeout(timeout);
  }, [points]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-2 z-20 flex justify-center"
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            key={visible.id}
            initial={{ y: 0, opacity: 0, scale: 0.6 }}
            animate={{
              y: prefersReducedMotion ? 0 : -32,
              opacity: 1,
              scale: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="rounded-full bg-green-600/90 px-3 py-1 text-sm font-extrabold text-white shadow-lg"
          >
            +{visible.value}
            {visible.multiplier > 1 && (
              <span className="ml-1 text-amber-200">×{visible.multiplier}</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
