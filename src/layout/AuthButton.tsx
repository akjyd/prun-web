import { useAuth } from "../contexts/auth/AuthContext";
import Discord from "../ui/icons/Discord";
import IconButton from "../ui/button/IconButton";
import styles from "./AuthButton.module.css";
import Menu from "../ui/menu/Menu";
import MenuItem from "../ui/menu/MenuItem";
import Pencil from "../ui/icons/Pencil";
import ClipboardClock from "../ui/icons/ClipboardClock";
import LogOut from "../ui/icons/LogOut";
import Shield from "../ui/icons/Shield";
import Avatar from "../ui/avatar/Avatar";
import UserShield from "../ui/icons/UserShield";
import type { UserRole } from "../features/profiles/type";
import User from "../ui/icons/User";
import UserPen from "../ui/icons/UserPen";
import { useState } from "react";
import Loader from "../ui/icons/Loader";
import ProfileDialog from "../features/profiles/ProfileDialog";

export default function AuthButton() {
  const { user, profile, signIn, signOut } = useAuth();
  const [editing, setEditing] = useState<boolean>(false);

  const [inPending, setInPending] = useState<boolean>(false);
  const [outPending, setOutPending] = useState<boolean>(false);

  //未登录
  if (user === null || user === undefined)
    return (
      <IconButton onClick={handleSignIn} disabled={inPending}>
        {inPending ? <Loader /> : <Discord />}
      </IconButton>
    );
  //已登录
  else
    return (
      <>
        <Menu trigger={<Avatar name={profile?.display_name ?? ""} />}>
          <div className={styles["user-head"]}>
            <Avatar name={profile?.display_name ?? ""} />
            <div className={styles["user-body"]}>
              <span className={styles["user-name"]}>
                {profile?.display_name ?? "?"}
              </span>
              <span className={styles["user-role"]}>
                {getRoleIcon(profile?.role)}
              </span>
            </div>
          </div>
          <hr />
          <MenuItem onClick={() => setEditing(true)}>
            <Pencil />
            更改名称
          </MenuItem>
          <MenuItem>
            <ClipboardClock />
            提交记录
          </MenuItem>
          {profile?.role === "admin" ? (
            <MenuItem>
              <Shield />
              管理后台
              <span className={`${styles.dot}`}>3</span>
            </MenuItem>
          ) : undefined}
          <hr />
          <MenuItem
            variant="danger"
            onClick={handleSignOut}
            disabled={outPending}
          >
            {outPending ? <Loader /> : <LogOut />}
            退出登录
          </MenuItem>
        </Menu>
        <ProfileDialog
          open={profile === null || editing}
          onClose={() => {
            setEditing(false);
          }}
          isCreate={profile === null}
        />
      </>
    );

  async function handleSignIn() {
    setInPending(true);

    try {
      await signIn();
    } catch (e) {
      console.error(e);
      setInPending(false);
    }
  }

  async function handleSignOut() {
    setOutPending(true);

    try {
      await signOut();
    } catch (e) {
      console.error(e);
    } finally {
      setOutPending(false);
    }
  }
}

function getRoleIcon(role: UserRole | undefined) {
  if (role === undefined) return "?";
  if (role === "user") return <User />;
  if (role === "trusted") return <UserPen />;
  if (role === "admin") return <UserShield />;
}
