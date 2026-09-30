import type { ComponentProps } from "react";
import inputStyles from "./InputBase.module.css";

export default function Input({
  className = "",
  size = "md",
  chars,
  ...props
}: Omit<ComponentProps<"input">, "size"> & {
  size?: "sm" | "md" | "lg";
  chars?: number;
}) {
  return (
    <input
      style={chars === undefined ? undefined : { width: `${chars}ch` }}
      {...props}
      className={`${className} ${inputStyles.input} ${inputStyles[size]}`}
    />
  );
}
