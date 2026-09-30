import React, { useRef, useState } from "react";
import Input from "./Input";
import styles from "./RangeInput.module.css";

export default function RangeInput({
  className = "",
  value,
  onChange,
  inputChars,
}: {
  className?: string;
  /** null = 还没填。0 是一个真实的利率，和没填不是一回事 */
  value: { min: number | null; max: number | null };
  onChange: (next: { min: number | null; max: number | null }) => void;
  inputChars?: number;
}) {
  const [linked, setLinked] = useState<boolean>(true);
  const lastEdited = useRef<"min" | "max" | undefined>(undefined);

  return (
    <div className={`${styles.container}`}>
      <Input
        chars={inputChars}
        value={value.min ?? ""}
        name="min"
        onChange={handleChange}
        className={`${className} ${styles.input}`}
        type="number"
      />
      <button
        className={`${styles.button}`}
        type="button"
        onClick={handleClick}
      >
        <span
          className={`${styles["link-container"]} ${linked ? styles["link-on"] : styles["link-off"]}`}
        >
          <span className={`${styles.line}`} />
          <span className={`${styles.dot}`} />
          <span className={`${styles.line}`} />
        </span>
      </button>
      <Input
        chars={inputChars}
        value={value.max ?? ""}
        name="max"
        onChange={handleChange}
        className={`${className} ${styles.input}`}
        type="number"
      />
    </div>
  );
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const eName = e.target.name;
    if (eName !== "min" && eName !== "max") return;
    // 清空时 e.target.value 是 ""，Number("") 会变成 0，框就永远清不空
    const eValue = e.target.value === "" ? null : Number(e.target.value);

    //没联动 只改自己的 不记录
    if (!linked) {
      onChange({ ...value, [eName]: eValue });

      return;
    }

    //联动 未改动过
    if (lastEdited.current === undefined) {
      lastEdited.current = eName;
      onChange({ min: eValue, max: eValue });
      return;
    }

    //联动了 只改动过一个框
    if (lastEdited.current === eName) {
      onChange({ min: eValue, max: eValue });
    } //联动 且改动了另外一个框
    else {
      setLinked(false);
      onChange({ ...value, [eName]: eValue });
    }
  }

  function handleClick() {
    //没联动->变成联动 记录重置 数值绑定
    if (!linked) {
      lastEdited.current = undefined;
      onChange({ min: value.min, max: value.min });
    }

    setLinked(!linked);
  }
}
