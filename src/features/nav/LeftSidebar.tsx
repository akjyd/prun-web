import { useParams } from "react-router";
import { postIndex } from "../../contents/posts";
import Group from "./SidebarGroup";
import SectionNav from "./SectionNav";
import styles from "./LeftSidebar.module.css";

export default function LeftSidebar({ menuOpen }: { menuOpen: boolean }) {
  const { section } = useParams();
  const groups = section === undefined ? undefined : postIndex[section];

  //分区不存在时只渲染空壳
  if (groups === undefined) {
    return <div className={menuOpen ? `${styles.sidebar} ${styles.open}` : styles.sidebar} />;
  }

  return (
    <div className={menuOpen ? `${styles.sidebar} ${styles.open}` : styles.sidebar}>
      <SectionNav className={styles.nav} />
      {Object.entries(groups).map(([group, slugs]) => (
        <Group key={group} group={group} slugs={slugs} />
      ))}
    </div>
  );
}
