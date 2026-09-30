import React, { useState } from "react";
import type { BankFormValues, Insert } from "./types";
import Field from "../../ui/form/Field";
import Input from "../../ui/form/Input";
import RangeInput from "../../ui/form/RangeInput";
import ToggleInput from "../../ui/form/ToggleInput";
import CheckboxGroup from "../../ui/form/CheckboxGroup";
import ListEditor from "../../ui/form/ListEditor";
import validate from "./validate";
import Button from "../../ui/button/Button";
import { insertBank } from "./api";

const EMPTY: BankFormValues = {
  user_name: "",
  rate: { min: null, max: null },
  limit: { num: null, special: false },
  currency_types: [],
  loan_types: [],
  discord_link: "",
  extra_links: [],
  extra_notes: [],
};

export default function BankForm() {
  const [form, setForm] = useState<BankFormValues>(EMPTY);
  const [error, setError] = useState<
    Partial<Record<keyof BankFormValues, string>>
  >({});
  const [step, setStep] = useState<number>(1);
  const [status, setStatus] = useState<
    "error" | "success" | "submitting" | null
  >(null);

  if (status === "submitting") return <div>提交中...</div>;
  if (status === "success") return <div>提交成功</div>;
  if (status === "error") return <div>提交失败!</div>;

  if (step === 1)
    return (
      <form onSubmit={handleSubmit}>
        <Field
          label="贷方名称"
          hint="格式:玩家名|公司代码,如 Pixel|ABC"
          errorHint={error.user_name}
          required
        >
          <Input
            value={form.user_name}
            onChange={(e) => setForm({ ...form, user_name: e.target.value })}
          />
        </Field>
        <Field label="Discord 链接" errorHint={error.discord_link} required>
          <Input
            value={form.discord_link}
            onChange={(e) => setForm({ ...form, discord_link: e.target.value })}
          />
        </Field>
        <Field
          label="利率（%）"
          hint="固定利率填写相同值"
          errorHint={error.rate}
          required
        >
          <RangeInput
            inputChars={10}
            value={form.rate}
            onChange={(next) => setForm({ ...form, rate: next })}
          />
        </Field>
        <Field label="额度（m）" errorHint={error.limit} required>
          <ToggleInput
            inputChars={10}
            toggleLabel="∞"
            value={form.limit}
            onChange={(next) => setForm({ ...form, limit: next })}
          />
        </Field>
        <Field
          as="div"
          label="支持币种"
          hint="可滑动多选"
          required
          errorHint={error.currency_types}
        >
          <CheckboxGroup
            variant="segmented"
            options={[
              { id: "ICA", label: "ICA" },
              { id: "NCC", label: "NCC" },
              { id: "CIS", label: "CIS" },
              { id: "AIC", label: "AIC" },
            ]}
            value={form.currency_types}
            onChange={(next) => setForm({ ...form, currency_types: next })}
          />
        </Field>
        <Field
          as="div"
          label="贷款类型"
          hint="可滑动多选"
          required
          errorHint={error.loan_types}
        >
          <CheckboxGroup
            variant="segmented"
            options={[
              { id: "stable", label: "稳定" },
              { id: "interest", label: "利息" },
            ]}
            value={form.loan_types}
            onChange={(next) => setForm({ ...form, loan_types: next })}
          />
        </Field>
        <Button type="button" onClick={handleNext}>
          下一步
        </Button>
      </form>
    );

  if (step === 2)
    return (
      <form onSubmit={handleSubmit}>
        <Field as="div" label="补充信息" hint="板块和条目都可拖动">
          <ListEditor
            addLabel="添加信息板块"
            variant="card"
            value={form.extra_notes}
            onChange={(next) => setForm({ ...form, extra_notes: next })}
            getKey={(note) => note.title}
            create={() => ({ title: "", items: [] })}
            renderHead={(note, update) => (
              <Input
                value={note.title}
                placeholder="标题"
                //行不通onChange={(e)=>setForm({...form,extra_notes:[...form.extra_notes]})
                //父级无法获得当前更改数据在数组中的位置
                onChange={(e) => update({ ...note, title: e.target.value })}
              />
            )}
            renderBody={(note, update) => (
              <>
                <Input
                  value={note.text ?? ""}
                  placeholder="描述"
                  onChange={(e) => update({ ...note, text: e.target.value })}
                />
                <ListEditor
                  addLabel="添加一条消息"
                  variant="plain"
                  value={note.items}
                  onChange={(next) => update({ ...note, items: next })}
                  create={() => ""}
                  renderHead={(item, updateLine) => (
                    <Input
                      value={item}
                      onChange={(e) => updateLine(e.target.value)}
                    />
                  )}
                />
              </>
            )}
          />
        </Field>

        <Field as="div" label="相关链接" hint="板块和条目都可拖动">
          <ListEditor
            addLabel="添加链接"
            variant="card"
            value={form.extra_links}
            onChange={(next) => setForm({ ...form, extra_links: next })}
            getKey={(link) => link.name}
            create={() => ({ name: "", link: "" })}
            renderHead={(link, update) => (
              <Input
                value={link.name}
                placeholder="名称"
                onChange={(e) => update({ ...link, name: e.target.value })}
              />
            )}
            renderBody={(link, update) => (
              <Input
                value={link.link}
                placeholder="链接"
                onChange={(e) => update({ ...link, link: e.target.value })}
              />
            )}
          />
        </Field>
        <Button>提交</Button>
      </form>
    );

  function handleNext() {
    const err = validate(form, step);

    if (Object.keys(err).length !== 0) {
      setError(err);
    } else setStep(step + 1);
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const err = validate(form, "all");

    if (Object.keys(err).length !== 0) {
      setError(err);
      return;
    } else {
      try {
        setStatus("submitting");

        await insertBank(toRow(form));

        setStatus("success");
      } catch (e) {
        console.error(e);
        setStatus("error");
      }
    }
  }
}

function toRow(form: BankFormValues): Insert {
  if (form.rate.min === null || form.rate.max === null)
    throw new Error("toRow 前必须先 validate");

  return {
    user_name: form.user_name,
    discord_link: form.discord_link,
    currency_types: form.currency_types,
    loan_types: form.loan_types,
    no_limit: form.limit.special,
    credit_limit: form.limit.num,
    rate_min: form.rate.min,
    rate_max: form.rate.max,
    extra_notes: form.extra_notes,
    extra_links: form.extra_links,
  };
}
