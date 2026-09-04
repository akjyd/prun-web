/**
 * 全站搜索：建索引 + 查询。
 *
 * 两个中文相关的处理：
 *
 * 1. 分词用 Intl.Segmenter
 *
 * 2. 拼音在「索引期」展开：一个中文词会同时以 原词 / 全拼 / 首字母
 *    三种形式进索引，查询期则原样拿用户输入去匹配
 */
import MiniSearch from "minisearch";
import { searchDocs } from "../contents/posts";
import { pinyin } from "pinyin-pro";
import type { SearchDoc, SearchHit } from "../types/content";

const STORE_FIELDS = [
  "title",
  "slug",
  "headingId",
  "headingText",
  "section",
] as const satisfies readonly (keyof SearchDoc)[];

const FIELDS = [
  "content",
  "headingText",
] as const satisfies readonly (keyof SearchDoc)[];

const segmenter = new Intl.Segmenter("zh", { granularity: "word" });

/**
 * 转拼音的公共配置。
 *
 * separator 必须是空串：默认会在每个字之间加空格，那样「贷款」变成
 * "dai kuan" 两个 term，用户输入 daikuan 就匹配不上。
 * v 是把 ü 转成 v，因为键盘上打的是 lv 不是 lü。
 */
const PINYIN_OPTIONS = {
  toneType: "none",
  v: true,
  nonZh: "consecutive",
  separator: "",
} as const;

const miniSearch = new MiniSearch({
  idField: "id",
  fields: [...FIELDS],
  storeFields: [...STORE_FIELDS],
  tokenize: (content) => {
    const segments = [...segmenter.segment(content)];
    return segments.filter((seg) => seg.isWordLike).map((seg) => seg.segment);
  },
  //索引期：中文词额外存全拼和首字母，这样用户打拼音也能命中
  processTerm: (term) => {
    term = term.toLowerCase();

    if (!/\p{Script=Han}/u.test(term)) return term;

    const full = pinyin(term, { ...PINYIN_OPTIONS, pattern: "pinyin" });
    const first = pinyin(term, { ...PINYIN_OPTIONS, pattern: "first" });

    return [term, full, first];
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
      //查询期不转拼音：用户输入的可能已经是拼音，再转一次就成了「拼音的拼音」。
      //这里和索引期的 processTerm 不对称，是有意的，别「顺手统一」。
      processTerm: (term) => term.toLowerCase(),
    })
    .map((r) => ({
      slug: r.slug,
      section: r.section,
      headingId: r.headingId,
      title: r.title,
      headingText: r.headingText,
      score: r.score,
    }));
}
