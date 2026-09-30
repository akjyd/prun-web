import { supabase } from "../../lib/supabase/client";
import type { Profile, ProfileForm } from "./type";

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error !== null)
    throw new Error("获取 Profile 数据失败", { cause: error });

  return data;
}

export async function upsertProfile(input: ProfileForm): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(input)
    .select()
    .single();

  if (error !== null)
    throw new Error("提交 Profile 数据失败", { cause: error });

  return data;
}
