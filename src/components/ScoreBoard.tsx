type ScoreBoardProps = {
  score: number;
  streak: number;
  highScore: number;
  bestStreak: number;
};

export function ScoreBoard({
  score,
  streak,
  highScore,
  bestStreak,
}: ScoreBoardProps) {
  return (
    <div className="score-board">
      <span>Score: {score}</span>
      <span>Streak: {streak}</span>
      <span>Best Score: {highScore}</span>
      <span>Best Streak: {bestStreak}</span>
    </div>
  );
}
