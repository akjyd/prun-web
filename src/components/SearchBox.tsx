import { useEffect, useRef, useState } from "react";
import search from "../search/search";
import type { SearchHit } from "../types/content";
import { Link } from "react-router";

export default function SearchBox() {
  const [query, setQuery] = useState<string>("");
  const [hits, setHits] = useState<SearchHit[] | undefined>(undefined);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setHits(search(query));
    }, 200);

    return () => clearTimeout(timeId);
  }, [query]);

  const hitsByTitle: Record<string, SearchHit[]> = {};
  hits?.slice(0, 10).forEach((hit) => {
    (hitsByTitle[hit.title] ??= []).push(hit);
  });

  const hitLinks = Object.entries(hitsByTitle).map(([title, hits]) => (
    <div key={title}>
      {title}
      {hits.map(({ section, slug, headingId, headingContent }) => (
        <Link
          key={`/${section}/${slug}#${headingId}`}
          to={`/${section}/${slug}#${headingId}`}
        >
          <div>{headingContent}</div>
        </Link>
      ))}
    </div>
  ));

  return (
    <>
      <button onClick={handleButton}>搜索</button>
      <dialog ref={dialogRef} className="dialog" onClick={handleDialog}>
        <input
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          value={query}
        />
        {hitLinks}
      </dialog>
    </>
  );

  function handleButton() {
    const dialog = dialogRef.current;
    if (dialog === null) return;
    dialog.showModal();
  }
  function handleDialog(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) dialogRef.current.close();
  }
}
