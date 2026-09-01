import { useMatch } from "react-router";
import { posts } from "../contents/posts";
import { useSection } from "../contexts/SectionContext";
import { useEffect, useState } from "react";

export default function RightSidebar() {
  const section = useSection();
  const match = useMatch(`/${section}/:slug`);
  const headings = posts[match?.params.slug ?? ""]?.headings;

  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    //初始化时插入顺序=headings顺序，所以第一个可见为当前高亮
    const visibilityByElement = new Map<Element, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibilityByElement.set(entry.target, entry.isIntersecting);
        }

        for (const [elem, visible] of visibilityByElement) {
          if (visible) {
            setHighlightId(elem.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -800px 0px" },
    );

    headings?.forEach(({ id }) => {
      const elem = document.getElementById(id);

      if (elem === null) return;

      visibilityByElement.set(elem, false);

      observer.observe(elem);
    });

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  const links = headings?.map(({ text, id }) => (
    <a
      href={"#" + id}
      key={id}
      className={id === highlightId ? "highlight" : undefined}
    >
      {text}
    </a>
  ));

  return <div className="right-sidebar">{links}</div>;
}
