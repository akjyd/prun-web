import { useParams } from "react-router";
import { postIndex } from "../contents/posts";
import Group from "./SidebarGroup";

export default function LeftSidebar({ hamOpen }: { hamOpen: boolean }) {
  const { section } = useParams();
  const groups = section === undefined ? undefined : postIndex[section];

  //分区不存在时只渲染空壳：判断「这个分区合不合法」是路由层的事，
  //侧边栏只负责没数据时别崩。
  if (groups === undefined) {
    return <div className={hamOpen ? "left-sidebar open" : "left-sidebar"} />;
  }

  return (
    <div className={hamOpen ? "left-sidebar open" : "left-sidebar"}>
      {Object.entries(groups).map(([group, slugs]) => (
        <Group key={group} group={group} slugs={slugs} />
      ))}
    </div>
  );
}
