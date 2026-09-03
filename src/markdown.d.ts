declare module "*.md" {
  type M = import("./types/content").MarkdownModule;

  export const frontmatter: M["frontmatter"];
  export const content: M["content"];
  export const headings: M["headings"];
  export const searchChunks: M["searchChunks"];
}
