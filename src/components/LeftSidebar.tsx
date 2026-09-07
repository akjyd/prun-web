import { useParams } from "react-router";
import { postIndex } from "../contents/posts";
import Group from "./SidebarGroup";
import SectionNav from "./SectionNav";

export default function LeftSidebar({ menuOpen }: { menuOpen: boolean }) {
  const { section } = useParams();
  const groups = section === undefined ? undefined : postIndex[section];

  //分区不存在时只渲染空壳
  if (groups === undefined) {
    return <div className={menuOpen ? "left-sidebar open" : "left-sidebar"} />;
  }

  return (
    <div className={menuOpen ? "left-sidebar open" : "left-sidebar"}>
      <SectionNav />
      {Object.entries(groups).map(([group, slugs]) => (
        <Group key={group} group={group} slugs={slugs} />
      ))}
    </div>
  );
}
