import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { useParams } from "react-router";
import { posts } from "../contents/posts";
import NotFound from "./NotFound";
import type { Post, Section } from "../types/content";
import { useSection } from "../contexts/SectionContext";

export default function Content() {
  const { slug } = useParams();
  const section = useSection();

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
