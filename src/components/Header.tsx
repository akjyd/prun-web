/**
 * 顶栏。
 *
 * 汉堡按钮在这里，但抽屉在 DocsLayout 里 —— 状态住在两者的共同父级
 * App，靠 props 下发。抽屉展开时会盖住整个顶栏（连同这个按钮），
 * 所以关闭只能点遮罩。
 */
import { Link, useMatch } from "react-router";
import useTheme from "../hooks/useTheme";
import SearchBox from "./SearchBox";
import Sun from "./icons/Sun";
import Moon from "./icons/Moon";
import Discord from "./icons/Discord";
import Menu from "./icons/Menu";
import SectionNav from "./SectionNav";

export default function Header({
  menuOpen,
  onMenuToggle,
}: {
  menuOpen: boolean;
  onMenuToggle: () => void;
}) {
  const { theme, toggleTheme } = useTheme();

  //只有文档页才有抽屉可开。首页没有侧栏，按钮不该出现
  const inDocs = useMatch("/:section/*") !== null;

  return (
    <div className="header">
      {inDocs && (
        <button
          className="menu-button"
          onClick={onMenuToggle}
          aria-expanded={menuOpen}
        >
          <Menu />
        </button>
      )}

      <Link className="logo" to="/">
        Prun
      </Link>

      <SectionNav />

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
