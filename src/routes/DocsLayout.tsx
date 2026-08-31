import { Outlet } from "react-router";
import LeftSidebar from "../components/LeftSidebar";
import RightSidebar from "../components/RightSidebar";
import type { Section } from "../types/content";

export default function DocsLayout({ section }: { section: Section }) {
  return (
    <div className="main-layout">
      <LeftSidebar section={section} />
      <div className="content">
        <Outlet context={section} />
      </div>
      <RightSidebar />
    </div>
  );
}
