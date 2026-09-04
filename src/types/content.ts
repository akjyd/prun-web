/**
 * 内容相关的类型，分属两层：
 *
 * 构建产物 —— MarkdownModule / Heading / SearchChunk：
 *   vite.config.ts 的插件生成、markdown.d.ts 声明的那些导出的形状。
 *   改插件的输出，这几个要跟着改。
 *
 * 应用内 —— Post / Posts / PostIndex / SearchDoc / SearchHit：
 *   posts.ts 在上面那些的基础上补了 section、group、slug 之后的形状。
 *
 * 两层曾经长得一样，从「分区改由目录结构决定」之后分家了，别再合并。
 */

export type Frontmatter = {
  title: string;
  date: string;
};

export type Post = {
  content: string;
  frontmatter: Frontmatter;
  headings: Heading[];
  section: string;
  group: string;
};

/** slug -> 文章 */
export type Posts = Record<string, Post>;

/** section -> 分组名 -> 该分组下的 slug 列表 */
export type PostIndex = Record<string, Record<string, string[]>>;

/**
 * 目录里的一条标题。
 *
 * 只含前三级 —— 插件在构建时就筛掉了 h4 以下。
 * 但 id 仍由「全部标题」依次生成，和页面上 rehype-slug 加的锚点一致。
 */
export type Heading = {
  text: string;
  id: string;
  depth: 1 | 2 | 3;
};

/** 插件在构建时切出的块，只包含单篇文章内部的信息 */
export type SearchChunk = {
  headingId: string;
  headingText: string;
  content: string;
};

/** 搜索用的一条文档:块 + 所属文章信息 */
export type SearchDoc = SearchChunk & {
  /** 全站唯一，MiniSearch 的 idField */
  id: string;
  slug: string;
  title: string;
  section: string;
};

/** md 模块的形状，由 vite.config.ts 的 markdown-plugin 产出 */
export type MarkdownModule = {
  frontmatter: Frontmatter;
  content: string;
  headings: Heading[];
  searchChunks: SearchChunk[];
};

/** 一条搜索结果:渲染结果列表所需的最小集合 */
export type SearchHit = {
  slug: string;
  section: string;
  headingId: string;
  title: string;
  headingText: string;
  score: number;
};
