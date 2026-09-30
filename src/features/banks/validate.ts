import type { BankFormValues } from "./types";

export default function validate(
  form: BankFormValues,
  step: number | "all",
): Partial<Record<keyof BankFormValues, string>> {
  const error: Partial<Record<keyof BankFormValues, string>> = {};

  if (step === 1 || step === "all") {
    if (form.user_name.trim() === "") error.user_name = "贷方名称不能为空";

    if (form.rate.min === null) error.rate = "最小值不能为空";
    if (form.rate.max === null) error.rate = "最大值不能为空";
    if (form.rate.max === null && form.rate.min === null)
      error.rate = "利率不能为空";
    if (
      form.rate.max !== null &&
      form.rate.min !== null &&
      form.rate.min > form.rate.max
    )
      error.rate = "最小值不能大于最大值";

    if (form.limit.special === false && form.limit.num === null)
      error.limit = "额度不能为空";
    if (form.currency_types.length === 0)
      error.currency_types = "支持币种不能为空";
    if (form.loan_types.length === 0) error.loan_types = "贷款类型不能为空";

    if (form.discord_link.trim() === "") error.discord_link = "链接不能为空";
    if (!URL.canParse(form.discord_link)) error.discord_link = "不是有效链接";
  }

  if (step === 2 || step === "all") {
    for (const [i, { name, link }] of form.extra_links.entries()) {
      const n = i + 1;
      if (name.trim() === "") error.extra_links = `第 ${n} 条链接缺名称`;
      else if (!URL.canParse(link))
        error.extra_links = `第 ${n} 条链接地址无效`;

      if (error.extra_links) break;
    }

    for (const [i, { title }] of form.extra_notes.entries()) {
      if (title.trim() === "") {
        error.extra_notes = `第 ${i + 1} 个板块缺标题`;
        break;
      }
    }
  }

  return error;
}
