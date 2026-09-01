import { posts } from "../contents/posts";
import { Link, useMatch } from "react-router";
import { useSection } from "../contexts/SectionContext";
import { useOpenGroups } from "../contexts/OpenGroupsContext";

export default function SidebarGroup({
  group,
  slugs,
}: {
  group: string;
  slugs: string[];
}) {
  const section = useSection();
  const { openGroups, toggleGroup } = useOpenGroups();
  const match = useMatch(`/${section}/:slug`);
  const currentSlug = match?.params.slug;

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
