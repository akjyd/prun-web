/**
 * 搜索结果摘要相关的字符串处理。
 *
 * 全是纯函数，不依赖 React —— 和「怎么渲染」无关，只管算。
 */
import { match } from "pinyin-pro";

/** 正文里被命中的一段，start 是字符下标 */
export type MatchRange = {
  start: number;
  length: number;
};

/**
 * 找出 query 在 content 里命中的最佳位置。
 *
 * 用 pinyin-pro 的 match 而不是 indexOf：索引里存的是拼音，原文是中文，match 能同时处理中文、
 * 全拼、首字母和中英混输。
 *
 * 但 match 返回的下标可能是分散的 —— 输入越短它越倾向于「每个字母配一个字
 * 的声母」，比如 dai 会散射成相距上百字的三个字符。所以这里只取最长的一段
 * 连续下标：连续才说明真的命中了一个词，也才值得高亮。散射的情况会退化成
 * 长度 1，窗口围绕它截，不会出现高亮跑到窗口外面。
 *
 * 返回 null 表示正文里没命中（比如词只出现在标题里）。
 */
export function getMatchRange(
  content: string,
  query: string,
): MatchRange | null {
  const indices = match(content, query);

  if (indices === null || indices.length === 0) return null;

  const first = indices[0];
  if (first === undefined) return null;

  let bestStart = first;
  let bestLength = 1;

  let currentStart = first;
  let currentLength = 1;

  for (let i = 1; i < indices.length; i++) {
    const index = indices[i];
    const prev = indices[i - 1];
    if (index === undefined || prev === undefined) continue;

    if (index === prev + 1) {
      currentLength++;
    } else {
      currentStart = index;
      currentLength = 1;
    }

    //用 > 而不是 >=：长度相同时保留靠前的那段，前面的上下文更可能有用
    if (currentLength > bestLength) {
      bestStart = currentStart;
      bestLength = currentLength;
    }
  }

  return { start: bestStart, length: bestLength };
}

/** 命中前后各保留多少字 */
const CONTEXT = 20;

/** 没命中时，摘要取正文开头多少字 */
const FALLBACK_LENGTH = 60;

/** 摘要：hit 是要高亮的那一段，为空表示正文里没命中 */
export type Snippet = {
  before: string;
  hit: string;
  after: string;
};

/**
 * 从正文里截一段围绕命中词的摘要。
 *
 * 空白必须先压平再算位置：range 里是字符下标，规范化会改变字符串长度，
 * 先算下标后规范化的话下标全部错位。所以顺序只能是
 * 规范化 -> 求 range -> 按 range 切
 */
export function buildSnippet(content: string, query: string): Snippet {
  //连续空白（含换行、表格里的对齐符）压成一个空格，摘要才能排成一行
  const text = content.replace(/\s+/g, " ").trim();

  const range = getMatchRange(text, query);

  if (range === null) {
    return { before: text.slice(0, FALLBACK_LENGTH), hit: "", after: "" };
  }

  const hitEnd = range.start + range.length;

  const windowStart = Math.max(0, range.start - CONTEXT);
  const windowEnd = Math.min(text.length, hitEnd + CONTEXT);

  return {
    before: text.slice(windowStart, range.start),
    hit: text.slice(range.start, hitEnd),
    after: text.slice(hitEnd, windowEnd),
  };
}
