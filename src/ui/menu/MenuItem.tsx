import type { ComponentProps } from "react";
import styles from "./MenuItem.module.css";

export default function MenuItem({
  children,
  className = "",
  variant = "default",
  ...props
}: ComponentProps<"button"> & { variant?: "default" | "danger" }) {
  return (
    <button
      {...props}
      type="button"
      className={`${styles["menu-item"]} ${className} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
