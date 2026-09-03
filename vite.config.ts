import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import matter from "gray-matter";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import type { Headings, SearchChunks } from "./src/types/content.ts";
import type { RootContent } from "mdast";

const markdownPlugin: Plugin = {
  name: "markdown-plugin",
  transform(code, id) {
    if (!id.endsWith(".md")) return null;

    const { data, content } = matter(code);

    const tree = fromMarkdown(content);
    const slugger = new GithubSlugger();

    const headings: Headings = [];
    const searchChunks: SearchChunks = [];
    let prevId = null;
    let lastHradingContent: string = "";
    let nodes: RootContent[] = [];

    //一次循环同时提取出headings和serchChunks
    for (const node of tree.children) {
      if (node.type === "heading") {
        const headingContent = toString(node);
        const id = slugger.slug(headingContent);
        const depth = node.depth;

        if (prevId !== null)
          searchChunks.push({
            headingId: prevId,
            content: toString(nodes),
            headingContent: lastHradingContent,
          });

        headings.push({ headingContent, id, depth });

        lastHradingContent = headingContent;

        //prevId 为 null 但有nodes
        //说明有一段文章在标题前面，合并到第一个标题处
        if (prevId !== null) nodes = [];

        prevId = id;
      } else {
        nodes.push(node);
      }
    }
    if (prevId !== null)
      searchChunks.push({
        headingId: prevId,
        content: toString(nodes),
        headingContent: lastHradingContent,
      });

    return {
      code: `export const frontmatter = ${JSON.stringify(data)};
export const content = ${JSON.stringify(content)};
export const headings = ${JSON.stringify(headings)};
export const searchChunks = ${JSON.stringify(searchChunks)};`,
      map: null,
    };
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), markdownPlugin],
});
