import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import matter from "gray-matter";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import type { Heading, SearchChunk } from "./src/types/content.ts";
import type { RootContent } from "mdast";

/** 目录只收前三级 */
const MAX_TOC_DEPTH = 3;

//拦截.md文件，产出四个导出，类型声明在markdown.d.ts
const markdownPlugin: Plugin = {
  name: "markdown-plugin",
  transform(code, id) {
    if (!id.endsWith(".md")) return null;

    const { data, content } = matter(code);

    const tree = fromMarkdown(content);
    const slugger = new GithubSlugger();

    const headings: Heading[] = [];
    const searchChunks: SearchChunk[] = [];

    /** 正在积累的块。id、标题、正文放在一起，不可能对不上 */
    let current: {
      headingId: string;
      headingText: string;
      nodes: RootContent[];
    } | null = null;

    /** 第一个标题之前的导语，会并入第一块 */
    let preambleNodes: RootContent[] = [];

    //slugger 有状态,所有标题必须在同一次遍历里按文档顺序过一遍。
    //分成两个循环会让重复标题的编号错位
    //和 rehype-slug 生成的 id 对不上。
    //
    //同理，深度不够的标题也不能整个跳过 —— 渲染时 rehype-slug 是给全部
    //h1~h6 编号的，少喂一个 slugger 就会让后面所有 id 错位。
    //只在「进不进目录」这一步筛，slug 照算不误。
    for (const node of tree.children) {
      if (node.type !== "heading") {
        if (current === null) preambleNodes.push(node);
        else current.nodes.push(node);
        continue;
      }

      const text = toString(node);
      const id = slugger.slug(text);

      if (isTocDepth(node.depth)) headings.push({ text, id, depth: node.depth });

      if (current !== null) searchChunks.push(toChunk(current));

      //首个标题时 preambleNodes 里可能有导语，直接当作新块的开头
      current = { headingId: id, headingText: text, nodes: preambleNodes };
      preambleNodes = [];
    }

    //最后一个块没有"下一个标题"来触发，循环结束后单独收尾
    if (current !== null) searchChunks.push(toChunk(current));

    const moduleCode = [
      `export const frontmatter = ${JSON.stringify(data)};`,
      `export const content = ${JSON.stringify(content)};`,
      `export const headings = ${JSON.stringify(headings)};`,
      `export const searchChunks = ${JSON.stringify(searchChunks)};`,
    ].join("\n");

    return { code: moduleCode, map: null };
  },
};

/**
 * 数字比较（depth <= 3）不会让 TS 收窄字面量联合类型，
 * 所以用类型守卫把「筛过之后一定是前三级」这件事告诉它。
 */
function isTocDepth(depth: number): depth is Heading["depth"] {
  return depth <= MAX_TOC_DEPTH;
}

/** 把积累中的块定稿：此刻才把 mdast 节点压成纯文本 */
function toChunk(current: {
  headingId: string;
  headingText: string;
  nodes: RootContent[];
}): SearchChunk {
  return {
    headingId: current.headingId,
    headingText: current.headingText,
    content: toString(current.nodes),
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), markdownPlugin],
});
