import React, { useEffect, useRef } from "react";
import styles from "./ProfileDialog.module.css";
import ProfileNameForm from "./ProfileNameForm";

export default function ProfileDialog({
  open,
  onClose,
  isCreate,
}: {
  open: boolean;
  onClose: () => void;
  isCreate: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  //为保证open是开关dialog的唯一真相
  //使用依赖于open的effect同步更新dialog
  //其他地方不再写，并且阻止掉原生的关闭开启调用
  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [open]);

  return (
    <dialog
      className={`${styles.dialog}`}
      ref={dialogRef}
      onCancel={handleCancel}
    >
      <div className={`${styles.panel}`}>
        {/* 只在打开时挂载，每次打开都是全新的表单状态 */}
        {open && <ProfileNameForm isCreate={isCreate} onClose={onClose} />}
      </div>
    </dialog>
  );

  function handleCancel(e: React.SyntheticEvent<HTMLDialogElement>) {
    e.preventDefault();

    if (!isCreate) onClose();
  }
}
