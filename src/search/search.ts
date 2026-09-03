import MiniSearch from "minisearch";
import { searchDocs } from "../contents/posts";
import { pinyin } from "pinyin-pro";
import type { SearchDoc, SearchHit } from "../types/content";

const STORE_FIELDS = [
  "title",
  "slug",
  "headingId",
  "headingContent",
  "section",
] as const satisfies readonly (keyof SearchDoc)[];

const FIELDS = [
  "content",
  "headingContent",
] as const satisfies readonly (keyof SearchDoc)[];

const segmenter = new Intl.Segmenter("zh", { granularity: "word" });

const miniSearch = new MiniSearch({
  idField: "id",
  fields: [...FIELDS],
  storeFields: [...STORE_FIELDS],
  tokenize: (content) => {
    const segments = [...segmenter.segment(content)];
    return segments.filter((seg) => seg.isWordLike).map((seg) => seg.segment);
  },
  processTerm: (term) => {
    term = term.toLowerCase();

    //中英文分开处理
    if (/\p{Script=Han}/u.test(term)) {
      const full = pinyin(term, {
        toneType: "none",
        v: true,
        nonZh: "consecutive",
        pattern: "pinyin",
        separator: "",
      });
      const first = pinyin(term, {
        toneType: "none",
        v: true,
        nonZh: "consecutive",
        pattern: "first",
        separator: "",
      });
      return [term, full, first];
    }

    return term;
  },
});

miniSearch.addAll(searchDocs);

export default function search(query: string | undefined): SearchHit[] {
  query = query?.trim();
  if (query === "" || query === undefined) return [];

  return miniSearch
    .search(query, {
      prefix: true,
      combineWith: "OR",
      processTerm: (term) => term.toLowerCase(),
    })
    .map((r) => ({
      slug: r.slug,
      section: r.section,
      headingId: r.headingId,
      title: r.title,
      headingContent: r.headingContent,
      score: r.score,
    }));
}
