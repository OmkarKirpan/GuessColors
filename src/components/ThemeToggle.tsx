import { useState } from "react";

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.body.classList.contains("darkmode"),
  );

  function changeTheme() {
    setIsDarkMode(document.body.classList.toggle("darkmode"));
  }

  return (
    <button
      type="button"
      className="fixed top-4 right-4 z-10 grid size-12 cursor-pointer place-items-center rounded-full bg-white text-xl shadow-lg ring-1 ring-slate-900/10 transition hover:scale-110 focus-visible:ring-4 focus-visible:ring-violet-500 motion-reduce:transition-none dark:bg-slate-800 dark:ring-white/20"
      aria-pressed={isDarkMode}
      onClick={changeTheme}
    >
      <span aria-hidden="true">{isDarkMode ? "☀️" : "🌙"}</span>
      <span className="sr-only">Change Theme</span>
    </button>
  );
}
