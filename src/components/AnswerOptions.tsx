type AnswerOptionsProps = {
  answers: string[];
  onSelect: (answer: string) => void;
};

export function AnswerOptions({ answers, onSelect }: AnswerOptionsProps) {
  return (
    <>
      {answers.map((answer) => (
        <button type="button" onClick={() => onSelect(answer)} key={answer}>
          {answer.toUpperCase()}
        </button>
      ))}
    </>
  );
}
