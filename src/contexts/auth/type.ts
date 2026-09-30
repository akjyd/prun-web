import type { User } from "@supabase/supabase-js";
import type { Profile, ProfileForm } from "../../features/profiles/type";

/**undefined表示未查询 null表示已查询确认没有该用户 */
export type AuthUser = User | undefined | null;
/**undefined表示未查询 null表示已查询确认没有该用户 */
export type AuthProfile = Profile | undefined | null;

export type Auth = {
  user: AuthUser;
  profile: AuthProfile;
  updateProfile: (input: ProfileForm) => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};
