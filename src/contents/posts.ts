/**
 * 内容层的唯一入口：把 src/contents/ 下的 md 文件变成应用能用的数据。
 *
 * 上游是 vite.config.ts 的 markdown-plugin —— 它在构建时把每个 md
 * 变成一个导出 frontmatter / content / headings / searchChunks 的模块。
 * 这里负责从文件路径补上 section 和 group，再摊平成三个导出：
 *
 *   posts       slug -> 文章，全站内容的真相源
 *   searchDocs  扁平的搜索文档，喂给 search.ts
 *   postIndex   section -> group -> slug[]，左栏渲染用
 *
 * 目录结构即分类：contents/<section>/<group>/<slug>.md，三层缺一不可。
 */
import type {
  MarkdownModule,
  PostIndex,
  Posts,
  SearchDoc,
} from "../types/content";

const markdowns = import.meta.glob<MarkdownModule>("./**/*.md", {
  eager: true,
});

/**
 * 全站文章的唯一源，自动收集 src/contents/ 下的 md 文件
 *
 * 键是文件名去掉 .md，同时也是 URL 里的那一段 ——
 * 改文件名等于改链接，已分享出去的地址会失效。
 *
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
 * 全站扁平的搜索文档数组，直接喂给 MiniSearch。
 *
 * 和 posts 各自独立遍历 markdowns
 * 换来两个导出互不依赖、各自读得懂。
 *
 * 路径解析失败的告警由 posts 那边统一发，这里静默跳过，避免重复刷屏。
 */
export const searchDocs = (function (): SearchDoc[] {
  const result: SearchDoc[] = [];

  for (const path in markdowns) {
    const markdown = markdowns[path];
    if (markdown === undefined) continue;

    const parts = getPathParts(path);
    if (parts === undefined) continue;

    const { section, slug } = parts;

    result.push(...buildSearchDocs(markdown, slug, section));
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
  }

  return result;
})();

function getPathParts(
  path: string,
): { section: string; group: string; slug: string } | undefined {
  const parts = path.replace(/\.md$/, "").replace("./", "").split("/");

  const section = parts[0];
  const group = parts[1];
  const slug = parts[2];

  if (section && group && slug) return { section, group, slug };
  else return undefined;
}

/** 把一篇文章的块加工成搜索文档：补上 slug、文章标题 */
function buildSearchDocs(
  markdown: MarkdownModule,
  slug: string,
  section: string,
): SearchDoc[] {
  return markdown.searchChunks.map((chunk) => {
    const { headingText, headingId, content } = chunk;

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
      headingText,
    };
  });
}
