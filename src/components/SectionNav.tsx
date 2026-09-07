import { Link, useMatch } from "react-router";

const TUTORIAL = "tutorial";
const REFERENCE = "reference";

export default function SectionNav() {
  const match = useMatch("/:section/*");
  const currsection = match?.params.section;

  return (
    <div className="nav-box">
      <Link
        to={"/" + TUTORIAL}
        className={currsection === TUTORIAL ? "highlight" : ""}
      >
        教程
      </Link>
      <Link
        to={"/" + REFERENCE}
        className={currsection === REFERENCE ? "highlight" : ""}
      >
        参考
      </Link>
    </div>
  );
}
