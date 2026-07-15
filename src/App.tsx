import "./App.css";
import { ColorSwatch } from "./components/ColorSwatch";
import { AnswerOptions } from "./components/AnswerOptions";
import { ResultMessage } from "./components/ResultMessage";
import { ThemeToggle } from "./components/ThemeToggle";
import { useGuessColorsGame } from "./hooks/useGuessColorsGame";

function App() {
  const { color, answers, result, handleAnswerClicked } =
    useGuessColorsGame();

  return (
    <div className="App">
      <ThemeToggle />
      <div>
        <ColorSwatch color={color} />
        <AnswerOptions answers={answers} onSelect={handleAnswerClicked} />
        <ResultMessage result={result} />
      </div>
    </div>
  );
}

export default App;
