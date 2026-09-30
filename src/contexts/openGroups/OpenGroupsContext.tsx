import { createContext, useContext } from "react";
import type { OpenGroups } from "./type";

export const OpenGroupsContext = createContext<OpenGroups | undefined>(
  undefined,
);

export function useOpenGroups(): OpenGroups {
  const openGroups = useContext(OpenGroupsContext);

  if (openGroups === undefined) {
    throw new Error("useOpenGroups 必须在 OpenGroupsContext 内部使用");
  }

  return openGroups;
}
