import { postIndex } from "../contents/posts";
import Group from "./SidebarGroup";
import { useSection } from "../contexts/SectionContext";

export default function LeftSidebar({ hamOpen }: { hamOpen: boolean }) {
  const section = useSection();
  const groups = postIndex[section];

  return (
    <div className={hamOpen ? "left-sidebar open" : "left-sidebar"}>
      {Object.entries(groups).map(([group, slugs]) => (
        <Group key={group} group={group} slugs={slugs} />
      ))}
    </div>
  );
}
