type ColorSwatchProps = {
  color: string;
  isWrong: boolean;
};

export function ColorSwatch({ color, isWrong }: ColorSwatchProps) {
  return (
    <div
      data-testid="guess-me"
      className={isWrong ? "guess-me shake" : "guess-me"}
      style={{ background: color }}
    ></div>
  );
}
