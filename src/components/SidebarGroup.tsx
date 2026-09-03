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
  const { openGroups, toggleGroup } = useOpenGroups();
  const { section, slug } = useParams();
  const currentSlug = slug;

  const key = section + group;
  const isGroupOpen =
    openGroups.has(key) ||
    (currentSlug === undefined ? false : slugs.includes(currentSlug));

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
    toggleGroup(key);
  }
}
