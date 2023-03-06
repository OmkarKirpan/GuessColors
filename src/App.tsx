import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [color, setColor] = useState("");
  const [answers, setAnswers] = useState<String[]>([]);
  const generateRandomColor = () => {
    return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
  };

  useEffect(() => {
    let actualColor = generateRandomColor();
    setColor(actualColor);
    setAnswers(
      [actualColor, generateRandomColor(), generateRandomColor()].sort(
        () => 0.5 * Math.random()
      )
    );
  }, []);

  function handleAnswerClicked(answer: String): void {
    if (answer === color) {
      console.log("Correct answer");
    } else {
      console.log("not correct answer");
    }
  }

  return (
    <div className="App">
      <div>
        <div className="guess-me" style={{ background: color }}></div>

        {answers.map((answer) => (
          <button onClick={() => handleAnswerClicked(answer)} key={answer}>
            {answer.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
