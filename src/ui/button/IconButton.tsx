import type { ComponentProps } from "react";
import styles from "./IconButton.module.css";

/**
 * 顶栏的图标按钮
 *
 */
export default function IconButton({
  className = "",
  ...props
}: ComponentProps<"button">) {
  return <button {...props} className={`${styles.button} ${className}`} />;
}
