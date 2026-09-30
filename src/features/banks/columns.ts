/** 列定义。表头、详情行 colSpan、tfoot 都从这里拿，改列只改这一处 */

import type { SortBy } from "./types";

/** 可排序的列。不可排序的三列（币种、贷款类型、操作）直接写在 JSX 里 */
export const SORTABLE: { by: SortBy; label: string }[] = [
  { by: "name", label: "名称" },
  { by: "rate", label: "利率" },
  { by: "limit", label: "额度" },
];

/** 总列数。跨整行的单元格用它做 colSpan */
export const COLUMN_COUNT = 6;
