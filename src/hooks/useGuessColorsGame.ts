import { useCallback, useEffect, useRef, useState } from "react";
import { type Achievement, Result } from "../types";
import { evaluateNewUnlocks, getAchievement } from "../utils/achievements";
import { shuffleArray } from "../utils/array";
import { generateDistractor, generateRandomColor } from "../utils/color";
import {
  BASE_POINTS,
  getComboMultiplier,
  getLevel,
  getLevelProgress,
} from "../utils/levels";
import { playSound } from "../utils/sound";
import { loadStats, saveStats } from "../utils/stats";

const ANSWER_KEYS: Record<string, number> = { "1": 0, "2": 1, "3": 2 };

export type PointsAwarded = { value: number; multiplier: number; id: number };
export type LastAnswer = { answer: string; correct: boolean; id: number };
export type EarnedAchievement = Achievement & { id: string; nonce: number };

export function useGuessColorsGame() {
  const [color, setColor] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<Result | undefined>(undefined);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState(() => loadStats());
  // XP (and therefore level and difficulty) is long-term progression that
  // persists across sessions, unlike the per-session score and streak.
  const [xp, setXp] = useState(() => stats.xp);
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [levelUpTrigger, setLevelUpTrigger] = useState(0);
  const [pointsAwarded, setPointsAwarded] = useState<PointsAwarded | null>(
    null,
  );
  const [lastAnswer, setLastAnswer] = useState<LastAnswer | null>(null);
  const [earnedAchievement, setEarnedAchievement] =
    useState<EarnedAchievement | null>(null);

  const level = getLevel(xp);
  const comboMultiplier = getComboMultiplier(streak);
  const levelProgress = getLevelProgress(xp);

  // Monotonic id so effect-driven UI (floating score, button flash, toast) can
  // key off a distinct value even when the underlying content repeats.
  const eventIdRef = useRef(0);

  // Difficulty for the very first round, derived once from the persisted level
  // so returning players resume at their level instead of restarting easy.
  const startDifficultyRef = useRef(Math.max(0, level - 1));

  const generateRound = useCallback((difficulty: number) => {
    const actualColor = generateRandomColor();
    const distractorColors = new Set<string>();

    while (distractorColors.size < 2) {
      const candidate = generateDistractor(actualColor, difficulty);
      if (candidate !== actualColor && !distractorColors.has(candidate)) {
        distractorColors.add(candidate);
      }
    }

    setColor(actualColor);
    setAnswers(shuffleArray([actualColor, ...distractorColors]));
  }, []);

  // Level 1 (difficulty 0) leaves the base color generation untouched; a
  // returning player at a higher level starts at their earned difficulty.
  useEffect(() => {
    generateRound(startDifficultyRef.current);
  }, [generateRound]);

  const handleAnswerClicked = useCallback(
    (answer: string): void => {
      eventIdRef.current += 1;
      const eventId = eventIdRef.current;

      if (answer !== color) {
        setResult(Result.Wrong);
        setStreak(0);
        setShakeTrigger((t) => t + 1);
        setLastAnswer({ answer, correct: false, id: eventId });
        playSound("wrong");
        return;
      }

      const nextScore = score + 1;
      const nextStreak = streak + 1;
      const multiplier = getComboMultiplier(nextStreak);
      const gained = BASE_POINTS * multiplier;
      const nextXp = xp + gained;
      const nextLevel = getLevel(nextXp);
      const leveledUp = nextLevel > level;

      setResult(Result.Correct);
      setScore(nextScore);
      setStreak(nextStreak);
      setXp(nextXp);
      setPointsAwarded({ value: gained, multiplier, id: eventId });
      setLastAnswer({ answer, correct: true, id: eventId });
      setConfettiTrigger((t) => t + 1);
      if (leveledUp) setLevelUpTrigger((t) => t + 1);

      // Persist records and evaluate achievements against the new game state.
      // Records only ever grow on a correct answer, so this is the single place
      // stats need saving.
      const bestStreak = Math.max(stats.bestStreak, nextStreak);
      const newUnlocks = evaluateNewUnlocks(
        {
          score: nextScore,
          streak: nextStreak,
          bestStreak,
          level: nextLevel,
        },
        stats.unlockedAchievements,
      );
      const nextStats = {
        highScore: Math.max(stats.highScore, nextScore),
        bestStreak,
        xp: nextXp,
        unlockedAchievements: newUnlocks.length
          ? [...stats.unlockedAchievements, ...newUnlocks]
          : stats.unlockedAchievements,
      };
      setStats(nextStats);
      saveStats(nextStats);

      if (newUnlocks.length) {
        const unlocked = getAchievement(newUnlocks[0]);
        if (unlocked) {
          setEarnedAchievement({ ...unlocked, nonce: eventId });
        }
        playSound("achievement");
      } else {
        playSound(leveledUp ? "levelUp" : "correct");
      }

      generateRound(Math.max(0, nextLevel - 1));
    },
    [color, score, streak, xp, level, stats, generateRound],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const index = ANSWER_KEYS[event.key];
      if (index === undefined) return;

      const answer = answers[index];
      if (answer === undefined) return;

      handleAnswerClicked(answer);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [answers, handleAnswerClicked]);

  return {
    color,
    answers,
    result,
    score,
    streak,
    xp,
    level,
    comboMultiplier,
    levelProgress,
    highScore: stats.highScore,
    bestStreak: stats.bestStreak,
    unlockedAchievements: stats.unlockedAchievements,
    shakeTrigger,
    confettiTrigger,
    levelUpTrigger,
    pointsAwarded,
    lastAnswer,
    earnedAchievement,
    handleAnswerClicked,
  };
}
