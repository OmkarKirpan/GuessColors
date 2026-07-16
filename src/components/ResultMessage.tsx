import { Result } from "../types";

type ResultMessageProps = {
  result: Result | undefined;
};

export function ResultMessage({ result }: ResultMessageProps) {
  const className =
    result === Result.Correct
      ? "correct"
      : result === Result.Wrong
        ? "wrong"
        : undefined;
  const message =
    result === Result.Correct
      ? "Correct!"
      : result === Result.Wrong
        ? "Wrong Answer"
        : "";

  return (
    <div role="status" className={className}>
      {message}
    </div>
  );
}
