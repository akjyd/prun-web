import { Outlet } from "react-router";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import type { Section } from "../types/content";
import { SectionContext } from "../contexts/SectionContext";
import { useState } from "react";

export default function DocsLayout({ section }: { section: Section }) {
  const [hamOpen, setHamOpen] = useState<boolean>(false);

  return (
    <SectionContext value={section}>
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
    </SectionContext>
  );

  function handleHamburger() {
    setHamOpen(!hamOpen);
  }
}
