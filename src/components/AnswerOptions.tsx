type AnswerOptionsProps = {
  answers: string[];
  onSelect: (answer: string) => void;
};

export function AnswerOptions({ answers, onSelect }: AnswerOptionsProps) {
  return (
    <>
      {answers.map((answer, index) => (
        <button
          type="button"
          onClick={() => onSelect(answer)}
          key={answer}
          aria-keyshortcuts={String(index + 1)}
        >
          {answer.toUpperCase()}
        </button>
      ))}
    </>
  );
}
