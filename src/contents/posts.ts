import type { Post, PostIndex, Posts } from "../types/content";

const markdowns = import.meta.glob<Post>("./*.md", { eager: true });

export const posts = (function (): Posts {
  const result: Posts = {};

  for (const key in markdowns) {
    const markdown = markdowns[key];
    if (markdown === undefined) continue;

    const slug = key.replace("./", "").replace(".md", "");
    result[slug] = {
      content: markdown.content,
      frontmatter: markdown.frontmatter,
      headings: markdown.headings,
    };
  }

  return result;
})();

export const postIndex = (function (): PostIndex {
  const index: PostIndex = { tutorial: {}, reference: {} };

  for (const slug in posts) {
    const post = posts[slug];
    if (post === undefined) continue;

    const { section, group } = post.frontmatter;
    const groups = index[section];
    const list = groups[group] ?? [];
    list.push(slug);
    groups[group] = list;
  }

  return index;
})();
