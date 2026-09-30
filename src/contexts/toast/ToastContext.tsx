import { createContext, useContext } from "react";
import type { ToastContextValue } from "./type";

export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined,
);

export function useToast(): ToastContextValue {
  const toast = useContext(ToastContext);

  if (toast === undefined) {
    throw new Error("useToast 必须在 ToastContext 内部使用");
  }

  return toast;
}
