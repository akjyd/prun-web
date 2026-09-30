import { useCallback, useState, type ReactNode } from "react";
import { ToastContext } from "./ToastContext";
import Toast from "../../ui/toast/Toast";
import type { ToastItem } from "./type";

export default function ToastContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  //存储toast信息的state，id是用crypto.randomUUID()生成
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback(() => setToasts((prev) => prev.slice(1)), []);
  const warning = (message: string) => add(message, "warning");
  const success = (message: string) => add(message, "success");
  const error = (message: string) => add(message, "error");

  return (
    //toast有值的时候才渲染toast,方便ts判定toast的值
    <ToastContext value={{ warning, error, success }}>
      {children}
      {/* status 必须常驻，内容变化才会被屏幕阅读器播报 */}
      <div role="status">
        {toasts[0] ? (
          <Toast key={toasts[0].id} toast={toasts[0]} onDismiss={dismiss} />
        ) : undefined}
      </div>
    </ToastContext>
  );

  function add(message: string, variant: ToastItem["variant"]) {
    setToasts((prev) => [
      ...prev,
      { id: crypto.randomUUID(), message, variant },
    ]);
  }
}
