import { Outlet } from "react-router";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import type { Section } from "../types/content";
import { SectionContext } from "../contexts/SectionContext";

export default function DocsLayout({ section }: { section: Section }) {
  return (
    <SectionContext value={section}>
      <div className="main-layout">
        <LeftSidebar />
        <div className="content">
          <Outlet />
        </div>
        <RightSidebar />
      </div>
    </SectionContext>
  );
}
