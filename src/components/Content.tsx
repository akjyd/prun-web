import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { useOutletContext, useParams } from "react-router";
import { posts } from "../content/posts";
import NotFound from "./NotFound";
import type { Post, Section } from "../types/content";

export default function Content() {
  const { slug } = useParams();
  const section = useOutletContext<Section>();

  const post = findPost(slug, section);

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
  section: Section,
): Post | undefined {
  if (slug === undefined) return undefined;

  const post = posts[slug];
  if (post === undefined) return undefined;
  if (post.frontmatter.section !== section) return undefined;

  return post;
}
