import { Link } from "react-router";

export default function Header() {
  return (
    <>
      <Link to="/">首页</Link>
      <Link to="/tutorial">教程</Link>
      <Link to="/reference">参考</Link>
    </>
  );
}
