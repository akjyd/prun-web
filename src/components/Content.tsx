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

  //有锚点就滚到对应标题（搜索结果、右栏目录都靠它），
  //没有锚点就回到顶部 —— 页面滚动的是 window，换文章不会自动重置，
  //否则从长文底部点进下一篇会停在中段。
  useEffect(() => {
    if (hash === "") {
      window.scrollTo(0, 0);
      return;
    }

    try {
      //手写的畸形 hash（如 #%E0%A4）会让 decodeURIComponent 抛异常
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
