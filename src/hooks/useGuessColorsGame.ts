import { useCallback, useEffect, useState } from "react";
import { Result } from "../types";
import { shuffleArray } from "../utils/array";
import { generateRandomColor } from "../utils/color";
import { loadStats, saveStats } from "../utils/stats";

const ANSWER_KEYS: Record<string, number> = { "1": 0, "2": 1, "3": 2 };

export function useGuessColorsGame() {
  const [color, setColor] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<Result | undefined>(undefined);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState(() => loadStats());
  const [shakeTrigger, setShakeTrigger] = useState(0);

  const generateRandomColors = useCallback(() => {
    const actualColor = generateRandomColor();
    const distractorColors = new Set<string>();

    while (distractorColors.size < 2) {
      const candidate = generateRandomColor();
      if (candidate !== actualColor && !distractorColors.has(candidate)) {
        distractorColors.add(candidate);
      }
    }

    setColor(actualColor);
    setAnswers(shuffleArray([actualColor, ...distractorColors]));
  }, []);

  useEffect(() => {
    generateRandomColors();
  }, [generateRandomColors]);

  useEffect(() => {
    setStats((prev) => {
      const nextHighScore = Math.max(prev.highScore, score);
      const nextBestStreak = Math.max(prev.bestStreak, streak);
      if (
        nextHighScore === prev.highScore &&
        nextBestStreak === prev.bestStreak
      ) {
        return prev;
      }
      const next = { highScore: nextHighScore, bestStreak: nextBestStreak };
      saveStats(next);
      return next;
    });
  }, [score, streak]);

  const handleAnswerClicked = useCallback(
    (answer: string): void => {
      if (answer === color) {
        setResult(Result.Correct);
        setScore((s) => s + 1);
        setStreak((s) => s + 1);
        generateRandomColors();
      } else {
        setResult(Result.Wrong);
        setStreak(0);
        setShakeTrigger((t) => t + 1);
      }
    },
    [color, generateRandomColors],
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
    highScore: stats.highScore,
    bestStreak: stats.bestStreak,
    shakeTrigger,
    handleAnswerClicked,
  };
}
