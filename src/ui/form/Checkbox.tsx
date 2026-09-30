import { type ComponentProps } from "react";
import styles from "./Checkbox.module.css";

export default function Checkbox({
  label,
  ...props
}: ComponentProps<"input"> & { label: string }) {
  return (
    <label className={`${styles.label}`}>
      <input type="checkbox" {...props} />
      {label}
    </label>
  );
}
