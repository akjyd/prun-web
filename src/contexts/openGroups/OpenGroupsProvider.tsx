import { useState } from "react";
import { OpenGroupsContext } from "./OpenGroupsContext";
import type { ReactNode } from "react";

/**
 * 持有左栏各组的开合状态。
 *
 * 挂在 Routes 外面，这样切换分区时不会随路由子树一起卸载 ——
 * 从教程逛到参考再逛回来，展开的组还在。只活在内存里，刷新即清空。
 */
export function OpenGroupsProvider({ children }: { children: ReactNode }) {
  const [groupOverrides, setGroupOverrides] = useState<Map<string, boolean>>(
    new Map(),
  );

  function setGroupOpen(key: string, open: boolean) {
    setGroupOverrides((prev) => {
      const next = new Map(prev);
      next.set(key, open);
      return next;
    });
  }

  return (
    <OpenGroupsContext value={{ groupOverrides, setGroupOpen }}>
      {children}
    </OpenGroupsContext>
  );
}
