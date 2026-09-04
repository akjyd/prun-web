/**
 * 左栏里的一个分组：一个可折叠的标题 + 组内文章链接。
 *
 * 开合状态用「默认值 + 用户覆盖」两层来算：
 *   默认  —— 当前文章所在的组是展开的（否则用户从外链进来找不到自己）
 *   覆盖  —— 用户点过的组，以他点的为准，存在 OpenGroupsContext 里
 *
 * 之所以不能只存一个「哪些组开着」的集合：默认值本身会随 URL 变，
 * 集合表达不了「我就是要关掉当前这个组」，会导致显示和状态分叉。
 */
import { posts } from "../contents/posts";
import { Link, useParams } from "react-router";
import { useOpenGroups } from "../contexts/OpenGroupsContext";

export default function SidebarGroup({
  group,
  slugs,
}: {
  group: string;
  slugs: string[];
}) {
  const { groupOverrides, setGroupOpen } = useOpenGroups();
  //重命名避开下面 map 里的 slug 参数
  const { section, slug: currentSlug } = useParams();

  const key = `${section}/${group}`;

  //当前正在看的文章，它所在的组默认展开 —— 否则从外部链接直接进来，
  //左栏是一排关着的标题，用户看不到自己在哪。
  const containsCurrentPost =
    currentSlug !== undefined && slugs.includes(currentSlug);

  //用户表过态就听他的，没表态才用上面那条默认规则
  const isGroupOpen = groupOverrides.get(key) ?? containsCurrentPost;

  const links = slugs.map((slug) => {
    const post = posts[slug];
    if (post === undefined) return null;

    return (
      <Link
        key={slug}
        to={`/${section}/${slug}`}
        className={currentSlug === slug ? "highlight" : undefined}
      >
        {post.frontmatter.title}
      </Link>
    );
  });

  return (
    <>
      <button onClick={handleClick}>
        {group}
        {isGroupOpen ? "▾" : "▸"}
      </button>
      {isGroupOpen && links}
    </>
  );

  function handleClick() {
    //翻转要在这里算：只有组件知道当前显示值是什么（它合并了默认规则），
    //provider 手里只有覆盖表，算不出来。
    setGroupOpen(key, !isGroupOpen);
  }
}
