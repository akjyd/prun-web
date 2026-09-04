import { useParams, Navigate } from "react-router";
import { postIndex } from "../contents/posts";
import NotFound from "./NotFound";

export default function SectionIndex() {
  const { section } = useParams();
  if (section === undefined) return <NotFound />;

  const groups = postIndex[section];
  if (groups === undefined) return <NotFound />;

  //「第一个组的第一篇」依赖 postIndex 的键顺序 = 文件扫描顺序（基本是
  //文件名字母序）。也就是说：改文件名会改变用户进入分区时看到的文章。
  const slugs = Object.values(groups)[0];
  if (slugs === undefined) return <NotFound />;

  const slug = slugs[0];
  if (slug === undefined) return <NotFound />;

  return <Navigate to={`/${section}/${slug}`} replace />;
}
