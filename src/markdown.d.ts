declare module "*.md" {
  export const frontmatter: import("./types/content").Frontmatter;
  export const content: string;
}
