import React, { useState } from "react";
import { useAuth } from "../../contexts/auth/AuthContext";
import Field from "../../ui/form/Field";
import Input from "../../ui/form/Input";
import Button from "../../ui/button/Button";
import type { ProfileForm } from "./type";
import validate from "./validate";
import styles from "./ProfileNameForm.module.css";
import Loader from "../../ui/icons/Loader";
import OctagonX from "../../ui/icons/OctagonX";
import { useToast } from "../../contexts/toast/ToastContext";

export default function ProfileNameForm({
  onClose,
  isCreate,
}: {
  onClose: () => void;
  isCreate: boolean;
}) {
  const { profile, updateProfile } = useAuth();
  const toast = useToast();

  //挂载时预填当前名字
  const [form, setForm] = useState<ProfileForm>({
    display_name: profile?.display_name ?? "",
  });
  const [error, setError] = useState<
    Partial<Record<keyof ProfileForm, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  //和输入框无关的错误（网络、服务器），显示在按钮上方
  const [submitError, setSubmitError] = useState<string | null>(null);

  return (
    <form onSubmit={handleSumbit}>
      <div className={`${styles["form-container"]}`}>
        <Field
          label={isCreate ? "创建显示名称" : "更改显示名称"}
          hint="格式:玩家名|公司代码,如 Pixel|ABC"
          errorHint={error.display_name}
        >
          <Input
            value={form.display_name}
            onChange={(e) => setForm({ ...form, display_name: e.target.value })}
          />
        </Field>
        {submitError && (
          <p role="alert" className={`${styles["submit-error"]}`}>
            <OctagonX />
            {submitError}
          </p>
        )}
        <div className={`${styles.actions}`}>
          {isCreate ? undefined : (
            <Button type="button" variant="secondary" onClick={() => onClose()}>
              取消
            </Button>
          )}
          <Button disabled={isSubmitting}>
            {isSubmitting ? <Loader /> : "保存"}
          </Button>
        </div>
      </div>
    </form>
  );

  async function handleSumbit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const err = validate(form, "all");

    if (Object.keys(err).length !== 0) {
      setError(err);

      return;
    } else {
      try {
        setSubmitError(null);
        setIsSubmitting(true);

        await updateProfile(form);

        toast.success("保存成功");

        onClose();
      } catch (e) {
        setSubmitError("保存失败，请检查网络后重试");
        setIsSubmitting(false);

        console.error(e);
      }
    }
  }
}
