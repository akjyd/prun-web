import type {
  MarkdownModule,
  PostIndex,
  Posts,
  SearchDocs,
} from "../types/content";

const markdowns = import.meta.glob<MarkdownModule>("./**/*.md", {
  eager: true,
});

/** 全站扁平的搜索文档数组，直接喂给 MiniSearch */
export const searchDocs: SearchDocs = [];

/**
 * 全站文章的唯一源，自动收集 src/contents/ 下的 md 文件
 *
 * 键是文件名去掉 .md，同时也是 URL 里的那一段 ——
 * 改文件名等于改链接，已分享出去的地址会失效。
 *
 * key = slug
 *
 * value =
 *
 * content 正文
 *
 * frontmatter 元数据
 *
 * headings 正文全部h1-h6
 */
export const posts = (function (): Posts {
  const result: Posts = {};

  for (const path in markdowns) {
    const markdown = markdowns[path];
    if (markdown === undefined) continue;

    const parts = getPathParts(path);
    if (parts === undefined) {
      console.warn("路径解析失败:", path);
      continue;
    }

    const { section, group, slug } = parts;

    searchDocs.push(...buildSearchDocs(markdown, slug, section));

    result[slug] = {
      content: markdown.content,
      frontmatter: markdown.frontmatter,
      headings: markdown.headings,
      section,
      group,
    };
  }

  return result;
})();

/**
 * 由 posts 派生的分组索引，供左栏按 section → group 渲染。
 *
 * 区名 -> 组名 -> slug[]
 */
export const postIndex = (function (): PostIndex {
  const result: PostIndex = {};

  for (const slug in posts) {
    const post = posts[slug];
    if (post === undefined) continue;

    const { section, group } = post;
    const groups = (result[section] ??= {});
    const list = (groups[group] ??= []);
    list.push(slug);
    groups[group] = list;
  }

  return result;
})();

function getPathParts(
  path: string,
): { section: string; group: string; slug: string } | undefined {
  const parts = path.replace(".md", "").replace("./", "").split("/");

  const section = parts[0];
  const group = parts[1];
  const slug = parts[2];

  if (section && group && slug) return { section, group, slug };
  else return undefined;
}

/** 把一篇文章的块加工成搜索文档：补上 slug、文章标题和拼音 */
function buildSearchDocs(
  markdown: MarkdownModule,
  slug: string,
  section: string,
): SearchDocs {
  return markdown.searchChunks.map((chunk) => {
    const { headingContent, headingId, content } = chunk;

    return {
      //标识+跳转
      id: `${slug}#${headingId}`,
      headingId,
      slug,
      section,

      //返回
      title: markdown.frontmatter.title,

      //搜索部分
      content,
      headingContent,
    };
  });
}
