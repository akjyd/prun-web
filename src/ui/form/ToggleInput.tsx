import type React from "react";
import styles from "./ToggleInput.module.css";
import Input from "./Input";
import Button from "../button/Button";

export default function ToggleInput({
  className = "",
  toggleLabel,
  value,
  onChange,
  inputChars,
}: {
  className?: string;
  toggleLabel: string;
  value: { num: number | null; special: boolean };
  onChange: (next: { num: number | null; special: boolean }) => void;
  inputChars?: number;
}) {
  return (
    <div className={`${styles.container}`}>
      <Input
        chars={inputChars}
        disabled={value.special}
        placeholder={value.special ? toggleLabel : ""}
        className={`${className} ${styles.input}`}
        type="number"
        value={value.special ? "" : (value.num ?? "")}
        onChange={handleChange}
      />
      <Button
        type="button"
        size="md"
        variant={value.special ? "primary" : "secondary"}
        className={styles.addon}
        onClick={() => onChange({ ...value, special: !value.special })}
      >
        {toggleLabel}
      </Button>
    </div>
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const eValue = e.target.value === "" ? null : Number(e.target.value);
    onChange({ ...value, num: eValue });
  }
}
