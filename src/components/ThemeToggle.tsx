function changeTheme() {
  document.body.classList.toggle("darkmode");
}

export function ThemeToggle() {
  return (
    <button className="theme-button" onClick={changeTheme}>
      Change Theme
    </button>
  );
}
