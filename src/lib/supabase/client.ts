import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../types/database";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_PUBLISHABLE_KEY;

if (!url) throw new Error("VITE_SUPABASE_URL缺失，请在.env.local中补全");
if (!key) throw new Error("VITE_PUBLISHABLE_KEY缺失，请在.env.local中补全");

export const supabase = createClient<Database>(url, key);
