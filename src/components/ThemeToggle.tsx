import { useState } from "react";

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.body.classList.contains("darkmode")
  );

  function changeTheme() {
    setIsDarkMode(document.body.classList.toggle("darkmode"));
  }

  return (
    <button
      className="theme-button"
      aria-pressed={isDarkMode}
      onClick={changeTheme}
    >
      Change Theme
    </button>
  );
}
