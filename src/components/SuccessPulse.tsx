import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

type SuccessPulseProps = {
  trigger: number;
};

// A green ring that flashes over the swatch on a correct answer. Because a
// correct guess regenerates the answer buttons immediately, the buttons can't
// linger to flash — so the "correct" cue lives here, on the swatch, which stays
// mounted. Renders nothing under prefers-reduced-motion.
export function SuccessPulse({ trigger }: SuccessPulseProps) {
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (trigger === 0 || prefersReducedMotion) return;
    setActive(trigger);
  }, [trigger, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden="true"
      data-success-pulse={active > 0 ? "active" : "idle"}
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl"
    >
      <AnimatePresence>
        {active > 0 && (
          <motion.span
            key={active}
            className="absolute inset-0 rounded-2xl ring-4 ring-green-400"
            initial={{ opacity: 0.9, scale: 1 }}
            animate={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={() => setActive(0)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
