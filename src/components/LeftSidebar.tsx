import { postIndex } from "../contents/posts";
import Group from "./SidebarGroup";
import { useSection } from "../contexts/SectionContext";

export default function LeftSidebar() {
  const section = useSection();
  const groups = postIndex[section];

  return (
    <div className="left-sidebar">
      {Object.entries(groups).map(([group, slugs]) => (
        <Group key={group} group={group} slugs={slugs} />
      ))}
    </div>
  );
}
