import { useCallback, useEffect, useState } from "react";
import { Result } from "../types";
import { shuffleArray } from "../utils/array";
import { generateRandomColor } from "../utils/color";

export function useGuessColorsGame() {
  const [color, setColor] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<Result | undefined>(undefined);

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

  function handleAnswerClicked(answer: string): void {
    if (answer === color) {
      setResult(Result.Correct);
      generateRandomColors();
    } else {
      setResult(Result.Wrong);
    }
  }

  return { color, answers, result, handleAnswerClicked };
}
