/**
 * 右栏目录：列出当前文章的标题，并高亮正在阅读的那一节。
 *
 * 目录数据来自 markdown 文本（构建时算好的 headings），不查 DOM。
 * 但「现在滚到哪了」只能问浏览器 —— 它取决于视口尺寸、字体、
 * 图片有没有加载完。所以组件直接读 DOM
 */
import { useParams } from "react-router";
import { posts } from "../contents/posts";
import React, { useEffect, useState } from "react";

/**
 * 判定线的位置，取视口高度的百分比。
 *
 * 算法：在视口 10% 高度处画一条线，最后一个越过这条线的标题
 * 就是当前所在的章节。
 */
const LINE_RATIO = 0.1;

export default function RightSidebar() {
  const { slug } = useParams();
  const headings = posts[slug ?? ""]?.headings;

  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    recompute();

    let ticking = false;

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", recompute);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recompute);
    };

    function recompute() {
      if (headings === undefined) {
        setHighlightId(null);
        return;
      }

      let currentId: string | null = null;

      for (const heading of headings) {
        const id = heading.id;
        const el = document.getElementById(id);

        if (el === null) continue;

        if (el.getBoundingClientRect().top <= window.innerHeight * LINE_RATIO)
          currentId = id;
        else break;
      }

      setHighlightId(currentId);
    }

    function onScroll() {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        recompute();
        ticking = false;
      });
    }
  }, [headings]);

  const links = headings?.map(({ text, id, depth }) => (
    <a
      href={"#" + id}
      key={id}
      className={id === highlightId ? "highlight" : undefined}
      style={{ "--depth": depth } as React.CSSProperties}
    >
      {text}
    </a>
  ));

  return <div className="right-sidebar">{links}</div>;
}
