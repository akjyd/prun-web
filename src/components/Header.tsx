import { Link, useMatch } from "react-router";
import useTheme from "../hooks/useTheme";
import SearchBox from "./SearchBox";
import Sun from "./icons/Sun";
import Moon from "./icons/Moon";
import Discord from "./icons/Discord";

const TUTORIAL = "tutorial";
const REFERENCE = "reference";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const match = useMatch("/:section/*");
  const currsection = match?.params.section;

  return (
    <div className="header">
      <Link className="logo" to="/">
        Prun
      </Link>

      <div className="nav-box">
        <Link
          to={"/" + TUTORIAL}
          className={currsection === TUTORIAL ? "highlight" : ""}
        >
          教程
        </Link>
        <Link
          to={"/" + REFERENCE}
          className={currsection === REFERENCE ? "highlight" : ""}
        >
          参考
        </Link>
      </div>

      <div className="actions-box">
        <SearchBox />
        <button className="theme-button" onClick={toggleTheme}>
          {theme === "light" ? <Sun /> : <Moon />}
        </button>
        <button className="login-button">
          <Discord />
        </button>
      </div>
    </div>
  );
}
