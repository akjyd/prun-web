import { useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "../../lib/supabase/client";
import { AuthContext } from "./AuthContext";
import type { AuthProfile, AuthUser } from "./type";
import { fetchProfile, upsertProfile } from "../../features/profiles/api";
import type { ProfileForm } from "../../features/profiles/type";

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<AuthUser>(undefined);
  const [profile, setProfile] = useState<AuthProfile>(undefined);

  const authValue = useMemo(
    () => ({ user, profile, signIn, signOut, updateProfile }),
    [user, profile],
  );

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    //防止竟态
    let cancelled = false;

    (async function () {
      if (user === undefined) {
        setProfile(undefined);
        return;
      }

      if (user === null) {
        setProfile(null);
        return;
      }

      const id = user.id;

      try {
        const data = await fetchProfile(id);

        if (cancelled) return;

        setProfile(data);
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return <AuthContext value={authValue}>{children}</AuthContext>;

  async function updateProfile(input: ProfileForm) {
    const newProfile = await upsertProfile(input);

    setProfile(newProfile);
  }
}

async function signIn() {
  //之所以使用origin和pathname拼接干净的字符串而不用href
  //是因为href带有的参数会影响回程时supabase拼接的url
  //导致onAuthStateChange获取和修改登录状态失败
  //结果就是url会卡在回程的样子，无法登录
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${window.location.origin}${window.location.pathname}`,
    },
  });

  if (error !== null) throw new Error("登录失败", { cause: error });
}

async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error !== null) throw new Error("登出失败", { cause: error });
}
