import styles from "./Avatar.module.css";

/** 品牌色圆底 + 名字首字母。没名字显示 ? */
export default function Avatar({ name }: { name: string }) {
  return (
    <span className={styles.avatar}>
      {name.charAt(0).toUpperCase() || "?"}
    </span>
  );
}
