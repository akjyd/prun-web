import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { useLocation, useParams } from "react-router";
import { posts } from "../contents/posts";
import NotFound from "./NotFound";
import type { Post } from "../types/content";
import { useEffect } from "react";

export default function Content() {
  const { section, slug } = useParams();
  const { hash } = useLocation();

  const post = findPost(slug, section);

  //适配搜索功能的滚动到标题处
  useEffect(() => {
    try {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      el?.scrollIntoView({ behavior: "smooth" });
    } catch (e) {
      console.warn("错误的hash地址", e);
    }
  }, [slug, hash]);

  if (post === undefined) return <NotFound />;

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSlug]}
    >
      {post.content}
    </Markdown>
  );
}

function findPost(
  slug: string | undefined,
  section: string | undefined,
): Post | undefined {
  if (slug === undefined) return undefined;

  const post = posts[slug];
  if (post === undefined) return undefined;
  if (post.section !== section) return undefined;

  return post;
}
