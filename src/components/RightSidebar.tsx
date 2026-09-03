import { useParams } from "react-router";
import { posts } from "../contents/posts";
import { useEffect, useState } from "react";

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
      if (headings === undefined) return;

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

  const links = headings?.map(({ headingContent: text, id }) => (
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
