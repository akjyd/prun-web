import { useRef, type ComponentProps } from "react";
import styles from "./CheckboxGroup.module.css";
import Checkbox from "./Checkbox";

/** 指针移动不到这个距离当作点击 */
const DRAG_THRESHOLD = 10;

/** 只管选项的排列和拖选。标签 / 提示 / 错误交给外面的 <Field as="div"> */
export default function CheckboxGroup<T extends string>({
  className = "",
  variant = "list",
  options,
  value,
  onChange,
  ...props
}: Omit<ComponentProps<"div">, "onChange"> & {
  variant?: "list" | "segmented";
  /** 有哪些选项，写死的配置。id 是提交用的凭证，label 给人看 */
  options: { id: T; label: string }[];
  /** 当前选中的 id 列表 */
  value: T[];
  /** 选中项变化时给出新的 id 列表 */
  onChange: (next: T[]) => void;
}) {
  /**
   * 一次拖选的中间态。
   *
   * 模型：按下时记快照和目标态；移动时用起点到当前点的矩形圈 item，
   * 圈到的设成目标态、没圈到的按快照。每次都从快照重算，划出去的自然恢复。
   *
   */
  type Drag = {
    /** 圈到的项要设成勾还是不勾 —— 起点按下前状态的反面 */
    targetChecked: boolean;
    /** 起点那一项。抬起时指针可能在容器外，找不到起点，只能靠这个 */
    startId: T;
    /** 按下那一刻的 value */
    snapshot: string[];
    startX: number;
    startY: number;
    /** 是否已过门槛。没过 = 这是一次点击 */
    dragged: boolean;
    /**上一次move计算的value数组，与next比较一致就不onchange */
    lastNext: string[];
  };

  const drag = useRef<Drag | undefined>(undefined);

  const checkboxes = options.map(({ id, label }) => (
    <Checkbox
      key={id}
      label={label}
      value={id}
      checked={value.includes(id)}
      // 只服务键盘（聚焦后按空格）。指针操作全走下面的 pointer 事件
      onChange={(e) => {
        if (e.target.checked) onChange([...value, id]);
        else onChange(value.filter((v) => v !== id));
      }}
    />
  ));

  return (
    <div
      {...props}
      className={`${className} ${styles[variant]} ${styles.container}`}
      onPointerDown={handleDragStart}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
      onPointerCancel={handleDragEnd}
    >
      {checkboxes}
    </div>
  );

  function handleDragStart(e: React.PointerEvent<HTMLDivElement>) {
    //鼠标右键，中间点击不会触发
    //多指触屏不会重置ref
    if (e.button !== 0 || !e.isPrimary) return;

    const target = e.target;
    if (!(target instanceof Element)) return;

    const input = target.closest("label")?.querySelector("input");
    if (input === undefined || input === null) return;

    const idx = Array.from(e.currentTarget.querySelectorAll("input")).indexOf(
      input,
    );

    const id = options[idx]?.id;
    if (id === undefined) return;

    // 一按下就捕获：否则没过门槛就出界抬起，容器收不到 up，ref 会挂着
    e.currentTarget.setPointerCapture(e.pointerId);

    drag.current = {
      targetChecked: !input.checked,
      startId: id,
      snapshot: value,
      startX: e.clientX,
      startY: e.clientY,
      dragged: false,
      lastNext: [],
    };
  }

  function handleDragMove(e: React.PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (current === undefined) return;

    const { startX, startY } = current;
    const { clientX, clientY } = e;

    if (!current.dragged) {
      if (Math.hypot(clientX - startX, clientY - startY) < DRAG_THRESHOLD)
        return;
      current.dragged = true;
    }

    const rect = {
      left: Math.min(startX, clientX),
      right: Math.max(startX, clientX),
      top: Math.min(startY, clientY),
      bottom: Math.max(startY, clientY),
    };

    const next: T[] = [];
    e.currentTarget.querySelectorAll("label").forEach((el, i) => {
      const id = options[i]?.id;
      if (id === undefined) return;

      if (intersects(el.getBoundingClientRect(), rect)) {
        if (current.targetChecked) next.push(id);
      } else if (current.snapshot.includes(id)) {
        next.push(id);
      }
    });

    if (
      current.lastNext.length === next.length &&
      current.lastNext.every((v, i) => v === next[i])
    )
      return;

    current.lastNext = next;
    onChange(next);
  }

  function handleDragEnd() {
    const current = drag.current;
    if (current === undefined) return;

    // 没过门槛 = 点击。捕获让 click 落在容器上、到不了 input，所以自己翻
    if (!current.dragged) {
      onChange(
        current.targetChecked
          ? [...value, current.startId]
          : value.filter((v) => v !== current.startId),
      );
    }
    drag.current = undefined;
  }
}

type Rect = { left: number; top: number; right: number; bottom: number };

/** 两个矩形有交集。反着想：只有四种情况没交集 —— a 完全在 b 的左/右/上/下 */
function intersects(a: Rect, b: Rect): boolean {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}
