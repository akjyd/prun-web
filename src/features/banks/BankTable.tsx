import { useState } from "react";
import type { Bank, SortBy, SortDir, SortPick } from "./types";
import styles from "./BankTable.module.css";
import BankRow from "./BankRow";
import { COLUMN_COUNT, SORTABLE } from "./columns";
import ArrowUp from "../../ui/icons/ArrowUp";
import Plus from "../../ui/icons/Plus";

/**
 * 每一列的取值函数。多个则依次用于破平 ——
 * 利率是区间，先比下限，下限相同再比上限（区间窄的排前面）。
 *
 * 加一列排序只需要往这里加一行，比较逻辑不用动。
 */
const GET: Record<SortBy, SortPick> = {
  name: [(b) => b.user_name],
  rate: [(b) => b.rate_min, (b) => b.rate_max],
  limit: [(b) => (b.no_limit ? Infinity : b.credit_limit)],
};

export default function BankTable({ banks }: { banks: Bank[] }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<{ by: SortBy; dir: SortDir }>({
    by: "name",
    dir: "asc",
  });

  const sortedBanks = banks.toSorted((a, b) =>
    compare(a, b, GET[sort.by], sort.dir === "asc" ? 1 : -1),
  );

  return (
    <table className={`not-md ${styles.table}`}>
      <thead>
        <tr>
          {SORTABLE.map(({ by, label }) => (
            <th
              key={by}
              className={styles.sortable}
              data-sort={sort.by === by ? sort.dir : undefined}
              onClick={() => handleSort(by)}
            >
              <div className={styles["sortable-inner"]}>
                {label}
                <ArrowUp />
              </div>
            </th>
          ))}
          <th>支持币种</th>
          <th>贷款类型</th>
        </tr>
      </thead>

      {sortedBanks.map((bank) => (
        <BankRow
          key={bank.id}
          bank={bank}
          open={expandedIds.has(bank.id)}
          onToggle={() => toggleExpanded(bank.id)}
        />
      ))}

      <tfoot>
        <tr>
          <td colSpan={COLUMN_COUNT}>
            <button className={`${styles["add-entry"]}`}>
              <Plus /> 添加条目
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
  );

  function handleSort(by: SortBy) {
    setSort((prev) =>
      prev.by === by
        ? { by, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { by, dir: "asc" },
    );
  }

  function toggleExpanded(id: string) {
    const next = new Set(expandedIds);
    if (expandedIds.has(id)) next.delete(id);
    else next.add(id);

    setExpandedIds(next);
  }
}

/**
 * 取值和比较分开：pick 决定取哪个字段，这里只管怎么比。
 * 平局就带着剩下的取值函数再问一次。
 *
 * null 一律沉底，且不参与方向翻转 —— 「没填」不是「值很小」。
 */
function compare(
  bankA: Bank,
  bankB: Bank,
  pick: SortPick,
  sign: 1 | -1,
): number {
  const [fn, ...rest] = pick;
  if (fn === undefined) return 0;

  const a = fn(bankA);
  const b = fn(bankB);

  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;

  let result;
  if (typeof a === "string" && typeof b === "string") {
    result = a.localeCompare(b, "zh", {
      ignorePunctuation: true,
      sensitivity: "base",
    });
  }
  if (typeof a === "number" && typeof b === "number") {
    result = a - b;
  }
  if (result === undefined) throw new Error("未知类型被比较");

  if (result === 0) return compare(bankA, bankB, rest, sign);

  return result * sign;
}
