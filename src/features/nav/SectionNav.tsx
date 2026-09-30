import { Link, useMatch } from "react-router";
import styles from "./SectionNav.module.css";

const TUTORIAL = "tutorial";
const REFERENCE = "reference";

//顶栏和抽屉各渲染一份，「哪一份可见」由宿主传 className 决定
export default function SectionNav({ className = "" }: { className?: string }) {
  const match = useMatch("/:section/*");
  const currsection = match?.params.section;

  return (
    <div className={`${styles.nav} ${className}`}>
      <Link
        to={"/" + TUTORIAL}
        className={`${styles.link} ${currsection === TUTORIAL ? styles.active : ""}`}
      >
        教程
      </Link>
      <Link
        to={"/" + REFERENCE}
        className={`${styles.link} ${currsection === REFERENCE ? styles.active : ""}`}
      >
        参考
      </Link>
    </div>
  );
}
