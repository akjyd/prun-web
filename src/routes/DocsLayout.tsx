import { Outlet, useLocation } from "react-router";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import { useState } from "react";

export default function DocsLayout() {
  const [hamOpen, setHamOpen] = useState<boolean>(false);
  const pathname = useLocation().pathname;

  //换了地址就关抽屉
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setHamOpen(false);
  }

  return (
    <>
      <button className="hamburger" onClick={handleHamburger}>
        ☰
      </button>
      <div className="main-layout">
        <div
          className={hamOpen ? "overlay open" : "overlay"}
          onClick={handleHamburger}
        ></div>
        <LeftSidebar hamOpen={hamOpen} />
        <div className="content">
          <Outlet />
        </div>
        <RightSidebar />
      </div>
    </>
  );

  function handleHamburger() {
    setHamOpen(!hamOpen);
  }
}
