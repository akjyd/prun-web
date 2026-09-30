import type { ProfileForm } from "./type";

export default function validate(
  form: ProfileForm,
  step: number | "all",
): Partial<Record<keyof ProfileForm, string>> {
  const error: Partial<Record<keyof ProfileForm, string>> = {};

  if (step === "all") {
    if (form.display_name.trim() === "")
      error.display_name = "显示名称不能为空";
  }

  return error;
}
