export type Section = "tutorial" | "reference";

export type Frontmatter = {
  title: string;
  date: string;
  /** 左栏分组名。开放集合：新增分组只改 md，不用改代码 */
  group: string;
  section: Section;
};

export type Post = {
  content: string;
  frontmatter: Frontmatter;
  headings: Headings;
};

/** slug -> 文章 */
export type Posts = Record<string, Post>;

/** section -> 分组名 -> 该分组下的 slug 列表 */
export type PostIndex = Record<Section, Record<string, string[]>>;

export type Headings = {
  text: string;
  id: string;
  depth: 1 | 2 | 3 | 4 | 5 | 6;
}[];
