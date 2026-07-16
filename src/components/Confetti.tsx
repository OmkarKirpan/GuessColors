import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const COLORS = [
  "#f43f5e",
  "#f59e0b",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
];
const PARTICLE_COUNT = 16;

type Particle = {
  x: number;
  y: number;
  rotate: number;
  color: string;
  delay: number;
};

type Burst = { id: number; particles: Particle[] };

function makeParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.6;
    const distance = 70 + Math.random() * 90;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotate: Math.random() * 360 - 180,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.08,
    };
  });
}

type ConfettiProps = {
  trigger: number;
};

// A one-shot particle burst radiating from the center of its (relatively
// positioned) parent. Re-fires whenever `trigger` changes. Renders nothing
// under prefers-reduced-motion.
export function Confetti({ trigger }: ConfettiProps) {
  const prefersReducedMotion = useReducedMotion();
  const [burst, setBurst] = useState<Burst | null>(null);

  useEffect(() => {
    if (trigger === 0 || prefersReducedMotion) return;
    setBurst({ id: trigger, particles: makeParticles() });
  }, [trigger, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      data-confetti={burst ? "active" : "idle"}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      <AnimatePresence>
        {burst && (
          <div key={burst.id} className="absolute top-1/2 left-1/2">
            {burst.particles.map((particle, index) => (
              <motion.span
                // biome-ignore lint/suspicious/noArrayIndexKey: particles are a fixed positional burst, never reordered
                key={index}
                className="absolute block size-2 rounded-[2px]"
                style={{ backgroundColor: particle.color }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                animate={{
                  x: particle.x,
                  y: particle.y,
                  opacity: 0,
                  scale: 0.5,
                  rotate: particle.rotate,
                }}
                transition={{
                  duration: 0.8,
                  delay: particle.delay,
                  ease: "easeOut",
                }}
                onAnimationComplete={
                  index === 0 ? () => setBurst(null) : undefined
                }
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
