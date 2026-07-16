import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in GuessColors:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="grid min-h-full place-items-center bg-rose-50 p-8 text-center font-sans dark:bg-slate-900"
        >
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Something went wrong. Please refresh the page to try again.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
