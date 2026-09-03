export type Frontmatter = {
  title: string;
  date: string;
  /** 左栏分组名。开放集合：新增分组只改 md，不用改代码 */
  index?: boolean;
};

export type Post = {
  content: string;
  frontmatter: Frontmatter;
  headings: Headings;
  section: string;
  group: string;
};

/** slug -> 文章 */
export type Posts = Record<string, Post>;

/** section -> 分组名 -> 该分组下的 slug 列表 */
export type PostIndex = Record<string, Record<string, string[]>>;

export type Headings = {
  headingContent: string;
  id: string;
  depth: 1 | 2 | 3 | 4 | 5 | 6;
}[];

/** 插件在构建时切出的块，只包含单篇文章内部的信息 */
export type SearchChunks = SearchChunk[];

type SearchChunk = {
  headingId: string;
  content: string;
  headingContent: string;
};

/** 喂给 MiniSearch 的一条文档：块 + 所属文章信息 + 拼音 */
export type SearchDoc = SearchChunk & {
  /** 全站唯一，MiniSearch 的 idField */
  id: string;
  slug: string;
  title: string;
  section: string;
};

export type SearchDocs = SearchDoc[];

export type MarkdownModule = {
  frontmatter: Frontmatter;
  content: string;
  headings: Headings;
  searchChunks: SearchChunks;
};

export type SearchHit = {
  slug: string;
  section: string;
  headingId: string;
  title: string;
  headingContent: string;
  score: number;
};
