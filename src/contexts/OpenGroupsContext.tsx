import { createContext, useContext } from "react";

type OpenGroups = {
  /**
   * 用户手动覆盖过的组：键是组的标识，值是他要的开合状态。
   *
   * 不在表里 = 用户没表过态，此时用默认值（当前文章所在的组默认展开）。
   */
  groupOverrides: Map<string, boolean>;
  setGroupOpen: (key: string, open: boolean) => void;
};

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
