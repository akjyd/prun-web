import type { ComponentProps } from "react";
import styles from "./Button.module.css";

export default function Button({
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      {...props}
      className={`${className} ${styles.button} ${styles[variant]} ${styles[size]}`}
    ></button>
  );
}
