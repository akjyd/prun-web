import type { Database } from "../../types/database";

type Row = Database["public"]["Tables"]["banks"]["Row"];
export type Insert = Database["public"]["Tables"]["banks"]["Insert"];

export type LoanType = Database["public"]["Enums"]["loan_type"];
type CurrencyType = Database["public"]["Enums"]["currency_type"];

type ExtraLink = { name: string; link: string };

export type ExtraNote = { title: string; text?: string; items: string[] };

export type Bank = Omit<Row, "extra_links" | "extra_notes"> & {
  extra_links: ExtraLink[] | null;
  extra_notes: ExtraNote[] | null;
};

export type BankFormValues = {
  user_name: string;
  rate: { min: number | null; max: number | null };
  limit: { num: number | null; special: boolean };
  currency_types: CurrencyType[];
  loan_types: LoanType[];
  discord_link: string;
  extra_links: ExtraLink[];
  extra_notes: ExtraNote[];
};

/* ---------- 排序 ---------- */

export type SortBy = "name" | "rate" | "limit";
export type SortDir = "asc" | "desc";
export type SortValue = string | number | null;
/** 一列的取值函数。多个则依次用于破平 */
export type SortPick = ((b: Bank) => SortValue)[];

export function assertExtraNotes(v: unknown): asserts v is ExtraNote[] {
  if (!(Array.isArray(v) && v.every(isExtraNote)))
    throw new Error("错误的 ExtraNotes 类型");
}

function isExtraNote(v: unknown): v is ExtraNote {
  return (
    typeof v === "object" &&
    v !== null &&
    "title" in v &&
    "items" in v &&
    typeof v.title === "string" &&
    //可选字段：没有就跳过，有就必须是字符串
    (!("text" in v) || v.text === undefined || typeof v.text === "string") &&
    Array.isArray(v.items) &&
    v.items.every((i) => typeof i === "string")
  );
}

export function assertExtraLinks(v: unknown): asserts v is ExtraLink[] {
  if (!(Array.isArray(v) && v.every(isExtraLink)))
    throw new Error("错误的 ExtraLink 类型");

  if (!v.every((link) => /^https?:\/\//.test(link.link)))
    throw new Error("ExtraLink 的 link 必须是 http/https 地址");
}

function isExtraLink(v: unknown): v is ExtraLink {
  return (
    typeof v === "object" &&
    v !== null &&
    "name" in v &&
    "link" in v &&
    typeof v.name === "string" &&
    typeof v.link === "string"
  );
}
