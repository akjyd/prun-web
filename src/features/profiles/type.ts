import type { Database } from "../../types/database";

type Row = Database["public"]["Tables"]["profiles"]["Row"];
type Insert = Database["public"]["Tables"]["profiles"]["Insert"];

export type UserRole = Database["public"]["Enums"]["user_role"];

export type Profile = Row;

/** 用户能写的列，和数据库的列级 grant 是同一份清单 */
export type ProfileForm = Pick<Insert, "display_name">;
