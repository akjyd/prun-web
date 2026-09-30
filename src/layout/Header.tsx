/**
 * 顶栏。
 *
 * 汉堡按钮在这里，但抽屉在 DocsLayout 里 —— 状态住在两者的共同父级
 * App，靠 props 下发。抽屉展开时会盖住整个顶栏（连同这个按钮），
 * 所以关闭只能点遮罩。
 */
import { Link, useMatch } from "react-router";
import SearchBox from "../features/search/SearchBox";
import Menu from "../ui/icons/Menu";
import SectionNav from "../features/nav/SectionNav";
import IconButton from "../ui/button/IconButton";
import ThemeToggle from "./ThemeToggle";
import AuthButton from "./AuthButton";
import styles from "./Header.module.css";

export default function Header({
  menuOpen,
  onMenuToggle,
}: {
  menuOpen: boolean;
  onMenuToggle: () => void;
}) {
  const sectionMatch = useMatch("/:section");
  const articleMatch = useMatch("/:section/:slug");
  const inDocs = sectionMatch !== null || articleMatch !== null;

  return (
    <div className={styles.header} data-in-docs={inDocs}>
      {inDocs && (
        <IconButton
          className={styles.menuButton}
          onClick={onMenuToggle}
          aria-expanded={menuOpen}
        >
          <Menu />
        </IconButton>
      )}

      <Link className={styles.logo} to="/">
        Prun
      </Link>

      <SectionNav className={styles.nav} />

      <div className={styles.actions}>
        <SearchBox />
        <ThemeToggle />
        <AuthButton />
      </div>
    </div>
  );
}
