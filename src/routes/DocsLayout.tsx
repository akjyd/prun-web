import { Outlet, useLocation } from "react-router";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import { useState } from "react";
import Menu from "../components/icons/Menu";

export default function DocsLayout() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const pathname = useLocation().pathname;

  //换了地址就关抽屉
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  return (
    <>
      <button className="menu-button" onClick={handleMenu}>
        <Menu />
      </button>
      <div
        className={menuOpen ? "overlay open" : "overlay"}
        onClick={handleMenu}
      ></div>
      <div className="main-layout">
        <LeftSidebar menuOpen={menuOpen} />
        <div className="content">
          <Outlet />
        </div>
        <RightSidebar />
      </div>
    </>
  );

  function handleMenu() {
    setMenuOpen(!menuOpen);
  }
}
