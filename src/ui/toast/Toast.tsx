import { useEffect, useRef, useState } from "react";
import type { ToastItem } from "../../contexts/toast/type";
import styles from "./Toast.module.css";
import CircleCheck from "../icons/CircleCheck";
import OctagonX from "../icons/OctagonX";
import TriangleAlert from "../icons/TriangleAlert";

export default function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  useEffect(() => {
    if (isLeaving) ref.current?.hidePopover();
    else ref.current?.showPopover();
  }, [isLeaving]);

  //倒计时显示，间隔3秒
  useEffect(() => {
    if (isPaused) return;

    const timerId = setTimeout(() => {
      setIsLeaving(true);
    }, 3000);

    return () => clearTimeout(timerId);
  }, [toast, isPaused]);

  let icon = undefined;
  if (toast.variant === "warning") icon = <TriangleAlert />;
  else if (toast.variant === "success") icon = <CircleCheck />;
  else if (toast.variant === "error") icon = <OctagonX />;

  //manual使得Toast可以手动控制开关
  return (
    <div
      popover="manual"
      ref={ref}
      className={`${styles.container}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <button
        className={`${styles.toast} ${styles[toast.variant]}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onClick={() => setIsLeaving(true)}
      >
        {icon}
        {toast.message}
      </button>
    </div>
  );

  function handleTransitionEnd(e: React.TransitionEvent<HTMLDivElement>) {
    if (
      e.target === e.currentTarget &&
      e.propertyName === "opacity" &&
      isLeaving
    )
      onDismiss();
  }
}
