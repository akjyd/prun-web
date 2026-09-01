import { useState } from "react";
import { OpenGroupsContext } from "./OpenGroupsContext";
import type { ReactNode } from "react";

export function OpenGroupsProvider({ children }: { children: ReactNode }) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  function toggleGroup(key: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);

      if (prev.has(key)) next.delete(key);
      else next.add(key);

      return next;
    });
  }

  return (
    <OpenGroupsContext value={{ openGroups, toggleGroup }}>
      {children}
    </OpenGroupsContext>
  );
}
