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
        <div className="App" role="alert">
          <p>Something went wrong. Please refresh the page to try again.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
