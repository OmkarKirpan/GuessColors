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
    setAnswers([actualColor, generateRandomColor(), generateRandomColor()]);
  }, []);

  return (
    <div className="App">
      <div className="guess-me" style={{ background: color }}></div>
    </div>
  );
}

export default App;
