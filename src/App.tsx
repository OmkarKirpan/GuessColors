import "./App.css";
import { AnswerOptions } from "./components/AnswerOptions";
import { ColorSwatch } from "./components/ColorSwatch";
import { ResultMessage } from "./components/ResultMessage";
import { ScoreBoard } from "./components/ScoreBoard";
import { ThemeToggle } from "./components/ThemeToggle";
import { useGuessColorsGame } from "./hooks/useGuessColorsGame";
import { Result } from "./types";

function App() {
  const {
    color,
    answers,
    result,
    score,
    streak,
    highScore,
    bestStreak,
    shakeTrigger,
    handleAnswerClicked,
  } = useGuessColorsGame();

  return (
    <div className="App">
      <ThemeToggle />
      <main>
        <h1>Guess Colors</h1>
        <ScoreBoard
          score={score}
          streak={streak}
          highScore={highScore}
          bestStreak={bestStreak}
        />
        <ColorSwatch
          key={shakeTrigger}
          color={color}
          isWrong={result === Result.Wrong}
        />
        <AnswerOptions answers={answers} onSelect={handleAnswerClicked} />
        <ResultMessage result={result} />
      </main>
    </div>
  );
}

export default App;
