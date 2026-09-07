/**
 * 搜索结果列表。
 *
 * 单独成文件是为了让 SearchBox 能用 lazy() 把它连同 search.ts
 * （以及 MiniSearch、pinyin-pro）一起切成独立 chunk，首屏不加载。
 *
 * 只管「给什么词搜什么词」——「要不要滞后」是 SearchBox 的决定。
 */
import search from "../search/search";
import { buildSnippet } from "../search/snippet";
import type { SearchHit } from "../types/content";
import { Link } from "react-router";

/** 结果列表最多显示多少条命中。注意限制的是「条」不是「篇」，
 *  10 条有可能全部来自同一篇文章 */
const MAX_HITS = 10;

export default function SearchResults({
  deferredQuery,
  active,
  onActiveChange,
  dialogRef,
}: {
  deferredQuery: string;
  active: string | undefined;
  onActiveChange: (url: string) => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}) {
  const hits = search(deferredQuery);

  if (hits.length === 0 && deferredQuery !== "") {
    return <div className="search-results">无法搜索到 "{deferredQuery}"</div>;
  }

  return (
    <div className="search-results" tabIndex={-1}>
      {groupBySlug(hits.slice(0, MAX_HITS)).map(({ slug, title, hits }) => (
        <div className="search-group" key={slug}>
          <div className="search-group-title">{title}</div>
          {hits.map(({ section, slug, headingId, headingText, content }) => {
            const { before, hit, after } = buildSnippet(content, deferredQuery);
            const url = `/${section}/${slug}#${headingId}`;

            return (
              <Link
                className="search-hit"
                key={url}
                to={url}
                data-active={active === url}
                onMouseEnter={() => onActiveChange(url)}
                onClick={() => dialogRef.current?.close()}
                tabIndex={-1}
              >
                <div className="search-hit-heading">{headingText}</div>
                <div className="search-hit-snippet">
                  {before}
                  <mark>{hit}</mark>
                  {after}
                </div>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}

type HitGroup = {
  slug: string;
  title: string;
  hits: SearchHit[];
};

/**
 * 把命中按所属文章归拢
 *
 * 用 slug 而不是 title 当键
 *
 * 组的顺序沿用命中顺序
 */
function groupBySlug(hits: SearchHit[]): HitGroup[] {
  const groups: HitGroup[] = [];
  const bySlug = new Map<string, HitGroup>();

  for (const hit of hits) {
    let group = bySlug.get(hit.slug);

    if (group === undefined) {
      group = { slug: hit.slug, title: hit.title, hits: [] };
      bySlug.set(hit.slug, group);
      groups.push(group);
    }

    group.hits.push(hit);
  }

  return groups;
}
