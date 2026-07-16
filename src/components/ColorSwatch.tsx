import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

type ColorSwatchProps = {
  color: string;
  shakeTrigger: number;
};

export function ColorSwatch({ color, shakeTrigger }: ColorSwatchProps) {
  const controls = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (shakeTrigger === 0 || prefersReducedMotion) return;

    let cancelled = false;
    setIsShaking(true);
    controls
      .start({
        x: [0, -10, 10, -8, 8, -4, 4, 0],
        transition: { duration: 0.4, ease: "easeInOut" },
      })
      .then(() => {
        if (!cancelled) setIsShaking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [shakeTrigger, prefersReducedMotion, controls]);

  return (
    <motion.div
      data-testid="guess-me"
      data-shaking={isShaking}
      animate={controls}
      className="h-48 w-full rounded-2xl ring-4 ring-slate-900/10 transition-[background-color,box-shadow] duration-300 motion-reduce:transition-none dark:ring-white/15"
      style={{ background: color, boxShadow: `0 12px 40px -8px ${color}` }}
    />
  );
}
