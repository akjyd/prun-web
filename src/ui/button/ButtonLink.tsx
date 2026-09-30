import type { ComponentProps } from "react";
import styles from "./Button.module.css";

export default function ButtonLink({
  className = "",
  variant = "primary",
  ...props
}: ComponentProps<"a"> & { variant?: "primary" | "secondary" }) {
  return (
    <a
      {...props}
      className={`${className} ${styles.button} ${styles[variant]}`}
    ></a>
  );
}
