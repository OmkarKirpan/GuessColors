import { useEffect, useState } from "react";
import "./App.css";
import ConfettiExplosion from 'react-confetti-explosion';


export const generateRandomColor = () => {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
};


enum Result {
  Correct,
  Wrong,
}


function App() {
  const [color, setColor] = useState("");
  const [bordercolor, setborderColor] = useState("");
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
  const generateColor = () => {
    let actualColor = generateRandomColor();
    setborderColor(actualColor);
  };


  useEffect(() => {
    generateRandomColors();
    generateColor();
  }, []);


  function handleAnswerClicked(answer: String): void {
    if (answer === color) {
      console.log("Correct answer");
      setResult(Result.Correct);
      generateRandomColors();
      // generateColor();
    } else {
      console.log("Wrong answer");
      setResult(Result.Wrong);
    }
  }




  return (
    <div className="App" style={{ background: color }} >


      <div className="congo">
        {result === Result.Correct && <ConfettiExplosion />}
      </div>
      <div className="main" style={{ borderColor: bordercolor }} >
        <h1>🎨GuessColors</h1>
        <h3>Test your yourself by guessing the right Hex code for the colors on the background</h3>
        <div data-testid="guess-me" className="guess-me" >


          {answers.map((answer, index) => (
            <button onClick={() => handleAnswerClicked(answer)} key={index}>
              {answer.toUpperCase()}
            </button>
          ))}
        </div>


        <p>
          {result === Result.Correct && <div className="correct"> You guessed it right!</div>}
          {result === Result.Wrong && <div className="wrong">Not your lucky guess!</div>}
        </p>
      </div>
    </div>
  );
}


export default App;




