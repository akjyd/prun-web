import { useParams } from "react-router";
import { postIndex } from "../contents/posts";
import Group from "./SidebarGroup";

export default function LeftSidebar({ hamOpen }: { hamOpen: boolean }) {
  const { section } = useParams();
  const groups = postIndex[section ?? ""];

  return (
    <div className={hamOpen ? "left-sidebar open" : "left-sidebar"}>
      {Object.entries(groups ?? {}).map(([group, slugs]) => (
        <Group key={group} group={group} slugs={slugs} />
      ))}
    </div>
  );
}
