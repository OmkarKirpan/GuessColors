import "./App.css";
import { AnswerOptions } from "./components/AnswerOptions";
import { ColorSwatch } from "./components/ColorSwatch";
import { ResultMessage } from "./components/ResultMessage";
import { ThemeToggle } from "./components/ThemeToggle";
import { useGuessColorsGame } from "./hooks/useGuessColorsGame";

function App() {
  const { color, answers, result, handleAnswerClicked } = useGuessColorsGame();

  return (
    <div className="App">
      <ThemeToggle />
      <main>
        <h1>Guess Colors</h1>
        <ColorSwatch color={color} />
        <AnswerOptions answers={answers} onSelect={handleAnswerClicked} />
        <ResultMessage result={result} />
      </main>
    </div>
  );
}

export default App;
