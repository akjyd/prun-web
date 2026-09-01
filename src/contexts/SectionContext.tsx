import { createContext, useContext } from "react";
import type { Section } from "../types/content";

export const SectionContext = createContext<Section | undefined>(undefined);

export function useSection(): Section {
  const section = useContext(SectionContext);

  if (section === undefined) {
    throw new Error("useSection 必须在 SectionContext 内部使用");
  }

  return section;
}
