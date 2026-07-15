import { Result } from "../types";

type ResultMessageProps = {
  result: Result | undefined;
};

export function ResultMessage({ result }: ResultMessageProps) {
  if (result === Result.Correct) {
    return <div className="correct">Correct!</div>;
  }
  if (result === Result.Wrong) {
    return <div className="wrong">Wrong Answer</div>;
  }
  return null;
}
