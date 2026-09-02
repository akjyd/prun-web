import { Link } from "react-router";
import useTheme from "../hooks/useTheme";

import type { Theme } from "../types/theme";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Link to="/">首页</Link>
      <Link to="/tutorial">教程</Link>
      <Link to="/reference">参考</Link>
      <button onClick={handleTheme}>{theme === "light" ? "☀️" : "🌙"}</button>
    </>
  );

  function handleTheme() {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    toggleTheme(newTheme);
  }
}
