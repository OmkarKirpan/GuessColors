import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

// jsdom does not implement window.matchMedia, which motion uses to honor
// prefers-reduced-motion. Motion subscribes once to the media query and
// caches the result, so the stub must dispatch change events when tests
// flip the flag via setPrefersReducedMotion.
type ChangeListener = (event: { matches: boolean; media: string }) => void;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const reducedMotionListeners = new Set<ChangeListener>();
let prefersReducedMotion = false;

export function setPrefersReducedMotion(value: boolean): void {
  if (prefersReducedMotion === value) return;
  prefersReducedMotion = value;
  for (const listener of reducedMotionListeners) {
    listener({ matches: value, media: REDUCED_MOTION_QUERY });
  }
}

beforeEach(() => {
  setPrefersReducedMotion(false);
});

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => {
    const isReducedMotionQuery = query.includes("prefers-reduced-motion");
    const track = (listener: unknown) => {
      if (isReducedMotionQuery && typeof listener === "function") {
        reducedMotionListeners.add(listener as ChangeListener);
      }
    };
    const untrack = (listener: unknown) => {
      reducedMotionListeners.delete(listener as ChangeListener);
    };
    return {
      get matches() {
        return isReducedMotionQuery && prefersReducedMotion;
      },
      media: query,
      onchange: null,
      addListener: track,
      removeListener: untrack,
      addEventListener: (_type: string, listener: unknown) => track(listener),
      removeEventListener: (_type: string, listener: unknown) =>
        untrack(listener),
      dispatchEvent: () => false,
    } as MediaQueryList;
  };
}
