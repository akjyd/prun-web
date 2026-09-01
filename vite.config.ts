import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import matter from "gray-matter";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import type { Headings } from "./src/types/content.ts";

const markdownPlugin: Plugin = {
  name: "markdown-plugin",
  transform(code, id) {
    if (!id.endsWith(".md")) return null;

    const { data, content } = matter(code);

    const tree = fromMarkdown(content);
    const slugger = new GithubSlugger();

    const headings: Headings = tree.children
      .filter((node) => node.type === "heading")
      .map((node) => {
        const text = toString(node);
        const id = slugger.slug(text);
        const depth = node.depth;

        return { text, id, depth };
      });

    return {
      code: `export const frontmatter = ${JSON.stringify(data)};
export const content = ${JSON.stringify(content)};
export const headings = ${JSON.stringify(headings)};`,
      map: null,
    };
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), markdownPlugin],
});
