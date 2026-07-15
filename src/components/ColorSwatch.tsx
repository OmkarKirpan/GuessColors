type ColorSwatchProps = {
  color: string;
};

export function ColorSwatch({ color }: ColorSwatchProps) {
  return (
    <div
      data-testid="guess-me"
      className="guess-me"
      style={{ background: color }}
    ></div>
  );
}
