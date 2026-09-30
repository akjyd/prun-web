/**
 * 文档页的三栏骨架。
 *
 * 抽屉的开合状态不在这里 —— 开关按钮在 Header 里，两者最近的
 * 共同父级是 App，状态住在那儿，这里只接收。
 */
import { Outlet } from "react-router";
import LeftSidebar from "../features/nav/LeftSidebar";
import RightSidebar from "../features/nav/RightSidebar";
import styles from "./DocsLayout.module.css";

export default function DocsLayout({
  menuOpen,
  onMenuToggle,
}: {
  menuOpen: boolean;
  onMenuToggle: () => void;
}) {
  return (
    <>
      {/* 遮罩。点它关抽屉 —— 抽屉盖住了顶栏，汉堡按钮点不到了 */}
      <div
        className={menuOpen ? `${styles.overlay} ${styles.open}` : styles.overlay}
        onClick={onMenuToggle}
      ></div>
      <div className={styles.grid}>
        <LeftSidebar menuOpen={menuOpen} />
        <div className="content">
          <Outlet />
        </div>
        <RightSidebar />
      </div>
    </>
  );
}
