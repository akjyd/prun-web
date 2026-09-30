import { useRef, useState, type ReactNode, type PointerEvent } from "react";
import Button from "../button/Button";

import styles from "./ListEditor.module.css";
import X from "../icons/X";
import Plus from "../icons/Plus";
import GripVertical from "../icons/gripVertical";

export default function ListEditor<T>({
  value,
  onChange,
  create,
  renderHead,
  renderBody,
  addLabel,
  emptyHint,
  variant = "card",
  getKey,
}: {
  value: T[];
  onChange: (next: T[]) => void;
  create: () => T;
  /** 头一行：有抓手和删除 */
  renderHead: (item: T, update: (next: T) => void) => ReactNode;
  /** 正文，缩进到和头一行的内容对齐。 */
  renderBody?: (item: T, update: (next: T) => void) => ReactNode;
  addLabel: string;
  emptyHint?: string;
  variant?: "card" | "plain";
  /** 稳定的 key。不传退回下标 —— 拖动排序时下标会串，有 id 的一定传 */
  getKey?: (item: T) => string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  // 拖动项
  const dragFrom = useRef<number | undefined>(undefined);
  // 插入线
  const [insertAt, setInsertAt] = useState<number | undefined>(undefined);

  const list = value.map((item, i) => {
    const update = (next: T) => onChange(value.with(i, next));

    return (
      <div
        key={getKey ? getKey(item) : i}
        className={`${styles.item} ${styles[variant]}`}
        data-insert={insertAt === i ? "" : undefined}
      >
        <div className={styles.head}>
          <button
            type="button"
            className={styles.drag}
            onPointerDown={(e) => handleDragStart(e, i)}
          >
            <GripVertical />
          </button>
          <div className={styles["head-body"]}>{renderHead(item, update)}</div>
          <button
            type="button"
            className={styles.remove}
            onClick={() => onChange(value.filter((_, j) => j !== i))}
          >
            <X />
          </button>
        </div>
        {renderBody && (
          <div className={styles.body}>{renderBody(item, update)}</div>
        )}
      </div>
    );
  });

  const ghostButton = (
    <Button
      type="button"
      variant="ghost"
      size="md"
      onClick={() => onChange([...value, create()])}
      className={`${styles["ghost-button"]}`}
    >
      <Plus /> {addLabel}
    </Button>
  );

  return value.length === 0 && variant === "card" ? (
    <div className={styles.empty}>
      <span className={styles["empty-hint"]}>{emptyHint}</span>
      {ghostButton}
    </div>
  ) : (
    <div
      ref={listRef}
      className={`${styles.list} ${styles[variant]}`}
      data-insert-end={insertAt === value.length ? "" : undefined}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
      onPointerCancel={handleDragCancel}
    >
      {list}
      {ghostButton}
    </div>
  );

  function handleDragStart(e: PointerEvent<HTMLButtonElement>, from: number) {
    if (e.button !== 0 || !e.isPrimary) return;
    // 捕获给列表容器
    listRef.current?.setPointerCapture(e.pointerId);
    dragFrom.current = from;
    setInsertAt(from);
  }

  function handleDragMove(e: PointerEvent<HTMLDivElement>) {
    if (dragFrom.current === undefined) return;

    const items = e.currentTarget.querySelectorAll<HTMLElement>(
      `:scope > .${styles.item}`,
    );
    let to = 0;
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (e.clientY > r.top + r.height / 2) to += 1;
    });
    setInsertAt(to);
  }

  function handleDragEnd() {
    const from = dragFrom.current;
    const to = insertAt;
    handleDragCancel();
    if (from === undefined || to === undefined) return;

    if (to === from || to === from + 1) return;

    const moved = value[from];
    if (moved === undefined) return;

    const next = value.filter((_, j) => j !== from);
    next.splice(to > from ? to - 1 : to, 0, moved);
    onChange(next);
  }

  function handleDragCancel() {
    dragFrom.current = undefined;
    setInsertAt(undefined);
  }
}
