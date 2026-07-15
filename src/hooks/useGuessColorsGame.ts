import { useEffect, useState } from "react";
import { generateRandomColor } from "../utils/color";
import { shuffleArray } from "../utils/array";
import { Result } from "../types";

export function useGuessColorsGame() {
  const [color, setColor] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<Result | undefined>(undefined);

  const generateRandomColors = () => {
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
  };

  useEffect(() => {
    generateRandomColors();
  }, []);

  function handleAnswerClicked(answer: string): void {
    if (answer === color) {
      console.log("Correct answer");
      setResult(Result.Correct);
      generateRandomColors();
    } else {
      console.log("Wrong answer");
      setResult(Result.Wrong);
    }
  }

  return { color, answers, result, handleAnswerClicked };
}
