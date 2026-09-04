import { useEffect, useState } from "react";

import type { Theme } from "../types/theme";

/** localStorage 的键。index.html 的内联脚本里也写着同一个字符串 */
const STORAGE_KEY = "theme";

type UseThemeResult = {
  /** 当前生效的主题 */
  theme: Theme;
  /** 在亮/暗之间切换，并写入 localStorage —— 此后不再跟随系统 */
  toggleTheme: () => void;
};

/**
 * 管理站点的亮/暗主题。优先级：用户选择 > 系统偏好。
 *
 * 初始值直接读 <html> 上的 data-theme，那是 index.html 的内联脚本
 * 在首屏绘制前设好的 —— 判断逻辑只在那里有一份，这里只负责读取。
 * 改那段脚本时记得回来看一眼。
 */
export default function useTheme(): UseThemeResult {
  const [theme, setTheme] = useState<Theme>(() => {
    const fromDom = document.documentElement.dataset.theme;

    //内联脚本没跑或值被改坏时的兜底
    return isTheme(fromDom) ? fromDom : "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: light)");

    query.addEventListener("change", syncWithSystem);

    return () => query.removeEventListener("change", syncWithSystem);

    function syncWithSystem(e: MediaQueryListEvent) {
      //存过值 = 用户表过态，系统怎么变都不再干预他的选择
      if (localStorage.getItem(STORAGE_KEY) !== null) return;

      setTheme(e.matches ? "light" : "dark");
    }
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";

    setTheme(next);

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      //无痕模式、存储配额满等情况会抛异常。主题照常切换，只是记不住
      console.warn("写入 localStorage 失败", e);
    }
  }

  return { theme, toggleTheme };
}

function isTheme(value: string | undefined): value is Theme {
  return value === "light" || value === "dark";
}
