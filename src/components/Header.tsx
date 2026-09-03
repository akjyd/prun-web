import { Link } from "react-router";
import useTheme from "../hooks/useTheme";

import type { Theme } from "../types/theme";
import SearchBox from "./SearchBox";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="header">
      <div>logo</div>
      <SearchBox />
      <Link to="/">首页</Link>
      <Link to="/tutorial">教程</Link>
      <Link to="/reference">参考</Link>
      <button onClick={handleTheme}>{theme === "light" ? "☀️" : "🌙"}</button>
    </div>
  );

  function handleTheme() {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    toggleTheme(newTheme);
  }
}
