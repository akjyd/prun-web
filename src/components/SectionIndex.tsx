import { useParams, Navigate } from "react-router";
import { postIndex } from "../contents/posts";
import NotFound from "./NotFound";

export default function SectionIndex() {
  const { section } = useParams();
  if (section === undefined) return <NotFound />;

  const groups = postIndex[section];
  if (groups === undefined) return <NotFound />;

  const slugs = Object.values(groups)[0];
  if (slugs === undefined) return <NotFound />;

  const slug = slugs[0];
  if (slug === undefined) return <NotFound />;

  return <Navigate to={`/${section}/${slug}`} replace />;
}
