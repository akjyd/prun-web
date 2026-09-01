import { useEffect, useState } from "react";

import type { Theme } from "../types/theme";

type UseThemeResult = {
  /** 当前生效的主题 */
  theme: Theme;
  /** 切换主题,并写入 localStorage —— 此后不再跟随系统 */
  toggleTheme: (newTheme: Theme) => void;
};

/**
 * 管理站点的亮/暗主题
 * 优先级本地->系统
 * 初始值读取<html>上的data-theme ---- 该属性由 index.html的内联脚本
 * 在首屏绘制时设好,注意保持一致
 * @returns theme 当前主题 toggleTheme 切换主题
 */
export default function useTheme(): UseThemeResult {
  const [theme, setTheme] = useState<Theme>(() => {
    const t = document.documentElement.dataset.theme;

    if (isTheme(t)) return t;
    else return "dark"; //实际上不可能走到这一步，骗ts用的
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const windowTheme = window.matchMedia("(prefers-color-scheme: light)");

    windowTheme.addEventListener("change", toggleThemeByWindow);

    return () => windowTheme.removeEventListener("change", toggleThemeByWindow);

    function toggleThemeByWindow(e: MediaQueryListEvent) {
      if (localStorage.getItem("theme")) return;

      const newTheme = e.matches ? "light" : "dark";

      setTheme(newTheme);
    }
  }, []);

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch {
      console.log("异常的localStorage设置");
    }
  };

  return { theme, toggleTheme };
}

function isTheme(localTheme: string | undefined): localTheme is Theme {
  return (
    localTheme !== undefined &&
    (localTheme === "light" || localTheme === "dark")
  );
}
