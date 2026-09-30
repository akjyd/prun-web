import {
  assertExtraLinks,
  assertExtraNotes,
  type Bank,
  type Insert,
} from "./types";
import { supabase } from "../../lib/supabase/client";

export async function fetchBanks(): Promise<Bank[]> {
  const { data, error } = await supabase.from("banks").select("*");
  if (error !== null) throw new Error("获取 Banks 数据失败", { cause: error });

  return data.flatMap((row) => {
    const notes = row.extra_notes;
    const links = row.extra_links;

    try {
      if (notes !== null) assertExtraNotes(notes);
      if (links !== null) assertExtraLinks(links);

      return [{ ...row, extra_links: links, extra_notes: notes }];
    } catch (e) {
      console.warn(`id ${row.id} 名称 ${row.user_name} 行数据格式错误`, e);
      return [];
    }
  });
}

export async function insertBank(row: Insert) {
  const { error } = await supabase.from("banks").insert(row);
  if (error !== null) throw new Error("提交 Bank 数据失败", { cause: error });
}
