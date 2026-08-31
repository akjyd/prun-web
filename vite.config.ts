import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import matter from "gray-matter";

const markdownPlugin: Plugin = {
  name: "markdown-plugin",
  transform(code, id) {
    if (!id.endsWith(".md")) return null;

    const { data, content } = matter(code);

    return {
      code: `export const frontmatter = ${JSON.stringify(data)};
export const content = ${JSON.stringify(content)}`,
      map: null,
    };
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), markdownPlugin],
});
