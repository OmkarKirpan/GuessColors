import { useEffect, useState } from "react";
import "./App.css";

import correctSound from "../sounds/correctSound.wav";
import incorrectSound from "../sounds/wrongSound.wav";

export const generateRandomColor = () => {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
};

enum Result {
  Correct,
  Wrong,
}

function App() {
  const [color, setColor] = useState("");
  const [answers, setAnswers] = useState<String[]>([]);
  const [result, setResult] = useState<Result | undefined>(undefined);

  const generateRandomColors = () => {
    let actualColor = generateRandomColor();
    setColor(actualColor);
    setAnswers(
      [actualColor, generateRandomColor(), generateRandomColor()].sort(
        () => 0.5 - Math.random()
      )
    );
  };

  useEffect(() => {
    generateRandomColors();
  }, []);

  function handleAnswerClicked(answer: String): void {
    if (answer === color) {
      console.log("Correct answer");
      setResult(Result.Correct);
      generateRandomColors();
      const audio = new Audio(correctSound);
      audio.play();
    } else {
      console.log("Wrong answer");
      setResult(Result.Wrong);
      const audio = new Audio(incorrectSound);
      audio.play();
    }
  }

  function changeTheme(){
    document.body.classList.toggle("darkmode");
  }


  return (
    <div className="App">
      <button
      className="theme-button"
      onClick={changeTheme}
      >Change Theme</button>
      <div>
        <div
          data-testid="guess-me"
          className="guess-me"
          style={{ background: color }}
        ></div>

        {answers.map((answer, index) => (
          <button onClick={() => handleAnswerClicked(answer)} key={index}>
            {answer.toUpperCase()}
          </button>
        ))}

        {result === Result.Correct && <div className="correct">Correct!</div>}
        {result === Result.Wrong && <div className="wrong">Wrong Answer</div>}
      </div>
    </div>
  );
}

export default App;
