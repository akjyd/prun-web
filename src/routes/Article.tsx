import { useParams } from "react-router";

export default function Article() {
  const { slug } = useParams();
  return (
    <>
      <div>{slug}</div>
      <div>文章页</div>
    </>
  );
}
