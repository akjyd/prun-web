import { Link } from "react-router";
import { posts, postIndex } from "../content/posts";
import type { Section } from "../types/content";

export default function LeftSidebar({ section }: { section: Section }) {
  const groups = postIndex[section];

  return (
    <div className="left-sidebar">
      {Object.entries(groups).map(([type, slugs]) => (
        <div key={type}>
          {type}
          {slugs.map((slug) => {
            const post = posts[slug];
            if (post === undefined) return null;

            return (
              <Link key={slug} to={`/${section}/${slug}`}>
                {post.frontmatter.title}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
