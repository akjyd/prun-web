/**
 * 样式验收页。只在开发环境注册路由（见 App.tsx），线上不存在。
 *
 * 浅深两套并排渲染：token 是挂在 [data-theme] 上的，所以在 div 上写
 * data-theme 就能让整棵子树换一套值，不用切全局主题来回对比。
 */
import { useState } from "react";
import Button from "../ui/button/Button";
import ButtonLink from "../ui/button/ButtonLink";
import IconButton from "../ui/button/IconButton";
import Field from "../ui/form/Field";
import Input from "../ui/form/Input";
import CheckboxGroup from "../ui/form/CheckboxGroup";
import RangeInput from "../ui/form/RangeInput";
import ToggleInput from "../ui/form/ToggleInput";
import ListEditor from "../ui/form/ListEditor";
import BankForm from "../features/banks/BankForm";
import ArrowUp from "../ui/icons/ArrowUp";
import ChevronRight from "../ui/icons/ChevronRight";
import Copy from "../ui/icons/Copy";
import CopyCheck from "../ui/icons/CopyCheck";
import Discord from "../ui/icons/Discord";
import Menu from "../ui/icons/Menu";
import MessageSquareMore from "../ui/icons/MessageSquareMore";
import Moon from "../ui/icons/Moon";
import Plus from "../ui/icons/Plus";
import Search from "../ui/icons/Search";
import Sun from "../ui/icons/Sun";
import Trash from "../ui/icons/Trash";
import X from "../ui/icons/X";
import { useToast } from "../contexts/toast/ToastContext";
import styles from "./Kitchen.module.css";

const FOREGROUND = [
  "--text-strong",
  "--text-weak",
  "--stroke-strong",
  "--stroke-weak",
  "--fill",
];

const BRAND = [
  "--text-brand",
  "--stroke-strong-brand",
  "--stroke-weak-brand",
  "--fill-brand",
];

/** 背景候选：色相固定 212，只变饱和度。明度三层固定 */
const BG_CANDIDATES = {
  light: { s: [0, 3, 4, 5], b: [90, 95, 100] },
  dark: { s: [0, 3, 5, 10, 15], b: [10, 15, 20] },
} as const;

function hsbToHex(h: number, s: number, b: number): string {
  s /= 100;
  b /= 100;
  const c = b * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const m = b - c;
  const [r, g, bl] =
    hp < 1
      ? [c, x, 0]
      : hp < 2
        ? [x, c, 0]
        : hp < 3
          ? [0, c, x]
          : hp < 4
            ? [0, x, c]
            : hp < 5
              ? [x, 0, c]
              : [c, 0, x];
  return (
    "#" +
    [r, g, bl]
      .map((v) =>
        Math.round((v + m) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

const CURRENCIES = [
  { id: "ICA", label: "ICA" },
  { id: "AIC", label: "AIC" },
  { id: "NCC", label: "NCC" },
  { id: "CIS", label: "CIS" },
];

const SYSTEM = ["error", "warning", "success"] as const;

const SURFACE = [
  "--background-base",
  "--background-raised",
  "--background-overlay",
];

const TYPE = [
  ["h1", "--text-h1"],
  ["h2", "--text-h2"],
  ["h3", "--text-h3"],
  ["body", "--text-body"],
  ["small", "--text-small"],
] as const;

const ICONS = [
  ["ArrowUp", ArrowUp],
  ["ChevronRight", ChevronRight],
  ["Copy", Copy],
  ["CopyCheck", CopyCheck],
  ["Discord", Discord],
  ["Menu", Menu],
  ["MessageSquareMore", MessageSquareMore],
  ["Moon", Moon],
  ["Plus", Plus],
  ["Search", Search],
  ["Sun", Sun],
  ["Trash", Trash],
  ["X", X],
] as const;

/** 实际在用的三档：表格里 small、顶栏 h3、放大看细节 */
const ICON_SIZES = ["var(--text-small)", "var(--text-h3)", "48px"];

const SPACE = ["xxs", "xs", "s", "m", "l", "xl", "xxl"];

export default function Kitchen() {
  return (
    <div className={styles.page}>
      <Panel theme="light" />
      <Panel theme="dark" />
    </div>
  );
}

function Panel({ theme }: { theme: "light" | "dark" }) {
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [limit, setLimit] = useState<{ num: number | null; special: boolean }>({
    num: 20,
    special: false,
  });
  const [links, setLinks] = useState<{ name: string; link: string }[]>([]);
  const [notes, setNotes] = useState<
    { title: string; text?: string; items: string[] }[]
  >([]);
  const [rate, setRate] = useState<{ min: number | null; max: number | null }>({
    min: 3,
    max: 3,
  });
  const toast = useToast();

  return (
    <div className={styles.panel} data-theme={theme}>
      <h1>{theme}</h1>

      <section className={styles.section}>
        <h2>按钮</h2>

        <div className={`${styles.row} ${styles.ruler}`}>
          <Button variant="primary">主按钮</Button>
          <Button variant="secondary">次按钮</Button>
          <ButtonLink variant="primary" href="#">
            主链接
          </ButtonLink>
          <ButtonLink variant="secondary" href="#">
            次链接
          </ButtonLink>
          <IconButton>
            <Discord />
          </IconButton>
        </div>
        <p className={styles.label}>三档尺寸，主 / 次各一份</p>
        <div className={styles.row}>
          {(["sm", "md", "lg"] as const).map((size) => (
            <Button key={size} variant="primary" size={size}>
              {size} 主按钮
            </Button>
          ))}
        </div>
        <div className={styles.row}>
          {(["sm", "md", "lg"] as const).map((size) => (
            <Button key={size} variant="secondary" size={size}>
              {size} 次按钮
            </Button>
          ))}
        </div>
        <p className={styles.label}>
          虚线框 = 48px 触摸区下限，按钮矮了就会露出来
        </p>

        <p className={styles.label}>三个背景层上各一份（验证 hover 叠加）</p>
        <div className={styles.layers}>
          {(["base", "raised", "overlay"] as const).map((layer) => (
            <div key={layer} className={`${styles.layer} ${styles[layer]}`}>
              <div className={styles.row}>
                <Button variant="primary">主</Button>
                <Button variant="secondary">次</Button>
              </div>
              <span className={styles.label}>{layer}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Toast</h2>

        <div className={styles.row}>
          <Button variant="secondary" onClick={() => toast.warning("警告提示")}>
            警告
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.success("提交成功")}
          >
            成功
          </Button>
          <Button variant="secondary" onClick={() => toast.error("提交失败")}>
            失败
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              toast.warning("第 1 条");
              toast.success("第 2 条");
              toast.error("第 3 条");
            }}
          >
            连弹 3 条
          </Button>
        </div>
        <p className={styles.label}>
          toast 挂在全局，主题跟随页面，不跟这个面板的 data-theme
        </p>
      </section>

      <section className={styles.section}>
        <h2>表单</h2>
        <p className={styles.label}>
          字段间距 32（书 p.352）。宽度按预期输入定（p.344），不全设同宽
        </p>
        <p className={styles.label}>输入框三档，和按钮同高（32 / 40 / 48）</p>
        <div className={styles.row}>
          {(["sm", "md", "lg"] as const).map((size) => (
            <Input key={size} size={size} placeholder={size} />
          ))}
        </div>

        <form className={styles.form} noValidate>
          <Field label="名称" required>
            <Input />
          </Field>

          <Field label="额度" hint="单位 M，无上限请勾选下方">
            <Input style={{ width: "8ch" }} />
          </Field>

          <Field label="利率" required errorHint="必须是 0 到 100 之间的数字">
            <Input style={{ width: "8ch" }} defaultValue="abc" />
          </Field>

          <Field
            label="Discord 链接"
            hint="以 https:// 开头"
            errorHint="不是有效的链接"
          >
            <Input defaultValue="discord.gg/abc" />
          </Field>

          <Field label="邮编" hint="4 位数字">
            <Input style={{ width: "6ch" }} />
          </Field>

          <Field label="已填好的">
            <Input defaultValue="lowstrife|MM" />
          </Field>

          <Field
            as="div"
            label="每还款周期利率（%）"
            required
            hint="只填左边即为固定利率；改右边则成为区间"
          >
            <RangeInput value={rate} onChange={setRate} />
          </Field>

          <Field
            as="div"
            label="额度"
            required
            hint="沿用社区写法，例如 1B2M 表示一个基地两百万"
          >
            <ToggleInput
              toggleLabel="无上限"
              value={limit}
              onChange={setLimit}
            />
          </Field>

          <Field
            as="div"
            label="利率（错误态）"
            required
            errorHint="下限不能大于上限"
          >
            <RangeInput value={{ min: 5, max: 3 }} onChange={() => {}} />
          </Field>

          <Field
            as="div"
            label="额度（错误态）"
            required
            errorHint="额度不能为空"
          >
            <ToggleInput
              toggleLabel="无上限"
              value={{ num: null, special: false }}
              onChange={() => {}}
            />
          </Field>

          <Field
            as="div"
            label="相关链接"
            hint="展示时出现在右侧，Discord 按钮下方"
          >
            <ListEditor
              value={links}
              onChange={setLinks}
              create={() => ({ name: "", link: "" })}
              addLabel="添加链接"
              emptyHint="贷款申请表、规则说明等"
              renderHead={(link, update) => (
                <Input
                  value={link.name}
                  placeholder="链接名称"
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

          <Field
            as="div"
            label="补充信息"
            hint="展示时出现在展开行的左侧。板块和条目都可以拖动排序"
          >
            <ListEditor
              value={notes}
              onChange={setNotes}
              create={() => ({ title: "", items: [] })}
              addLabel="添加一个板块"
              emptyHint="贷款周期、还款方式、额度分档、特殊要求等"
              renderHead={(note, update) => (
                <Input
                  value={note.title}
                  placeholder="板块标题，例如：额度"
                  onChange={(e) => update({ ...note, title: e.target.value })}
                />
              )}
              renderBody={(note, update) => (
                <>
                  <Input
                    value={note.text ?? ""}
                    placeholder="总述（选填），例如：初始利率 3.75%，每满足一项 -0.25%"
                    onChange={(e) => update({ ...note, text: e.target.value })}
                  />
                  {/* 条目本身也是一个列表：内层 ListEditor，T 是 string */}
                  <ListEditor
                    variant="plain"
                    value={note.items}
                    onChange={(items) => update({ ...note, items })}
                    create={() => ""}
                    addLabel="添加一条"
                    emptyHint="一条补充说明"
                    renderHead={(line, updateLine) => (
                      <Input
                        value={line}
                        placeholder="一条补充说明"
                        onChange={(e) => updateLine(e.target.value)}
                      />
                    )}
                  />
                </>
              )}
            />
          </Field>

          <Field as="div" label="支持币种">
            <CheckboxGroup
              variant="list"
              options={CURRENCIES}
              value={currencies}
              onChange={setCurrencies}
            />
          </Field>

          <Field as="div" label="支持币种">
            <CheckboxGroup
              variant="segmented"
              options={CURRENCIES}
              value={currencies}
              onChange={setCurrencies}
            />
          </Field>
        </form>
      </section>

      <section className={styles.section}>
        <h2>BankForm</h2>
        <BankForm />
      </section>

      <section className={styles.section}>
        <h2>图标</h2>
        <p className={styles.label}>
          除 Discord 外全部 viewBox 24×24 / strokeWidth 2 / fill none。 Discord
          是品牌 logo，只能实心填充 —— 它和描边图标混排时视觉重量偏重，
          放大那一档最容易看出来
        </p>

        {ICON_SIZES.map((size) => (
          <div key={size}>
            <p className={styles.label}>{size}</p>
            <div
              className={styles.icons}
              style={{ "--icon-size": size } as React.CSSProperties}
            >
              {ICONS.map(([name, Icon]) => (
                <div key={name} className={styles.icon}>
                  <Icon />
                  <span className={styles.label}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className={styles.label}>
          和正文并排：看图标的视觉重量压不压得住文字
        </p>
        <p className={styles["icon-inline"]}>
          正文 <Search /> 里的 <Plus /> 图标 <Trash /> 和 <MessageSquareMore />{" "}
          文字
        </p>
      </section>

      <section className={styles.section}>
        <h2>品牌色 vs 邻居文字</h2>
        <p className={styles.label}>
          APCA 只测明度。深色下 brand vs text-weak = 0.0，两者一样亮，
          区别全在色相 —— 所以链接必须有下划线（书 p.85：别只靠颜色）
        </p>

        <p>
          正文里有<a href="#">带下划线的链接</a>，也有
          <span className={styles.plain}>不带下划线的品牌色文字</span>，
          看哪个能一眼认出来。
        </p>

        <p style={{ color: "var(--text-weak)" }}>
          次要文字里有<a href="#">带下划线的链接</a>，也有
          <span className={styles.plain}>不带下划线的品牌色文字</span>。
        </p>

        <div className={styles.compare}>
          <div>
            <div style={{ color: "var(--text-strong)" }}>
              繁荣宇宙 Prosperous
            </div>
            <span className={styles.label}>text-strong</span>
          </div>
          <div>
            <div style={{ color: "var(--text-weak)" }}>繁荣宇宙 Prosperous</div>
            <span className={styles.label}>text-weak</span>
          </div>
          <div>
            <div style={{ color: "var(--text-brand)" }}>
              繁荣宇宙 Prosperous
            </div>
            <span className={styles.label}>text-brand</span>
          </div>
        </div>

        <p className={styles.label}>眯眼测试（模糊后只剩明暗，色相消失）</p>
        <div className={`${styles.compare} ${styles.squint}`}>
          <div style={{ color: "var(--text-strong)" }}>繁荣宇宙 Prosperous</div>
          <div style={{ color: "var(--text-weak)" }}>繁荣宇宙 Prosperous</div>
          <div style={{ color: "var(--text-brand)" }}>繁荣宇宙 Prosperous</div>
        </div>

        <p className={styles.label}>三个背景层上的链接</p>
        <div className={styles.layers}>
          {(["base", "raised", "overlay"] as const).map((layer) => (
            <div key={layer} className={`${styles.layer} ${styles[layer]}`}>
              正文 <a href="#">链接</a> 正文
              <div className={styles.label}>{layer}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>背景候选</h2>
        <p className={styles.label}>
          色相 212 固定，横向比饱和度。每组三层嵌套：base ⊃ raised ⊃ overlay
        </p>
        <div className={styles["bg-grid"]}>
          {BG_CANDIDATES[theme].s.map((sat) => {
            const [base, raised, overlay] = BG_CANDIDATES[theme].b.map((b) =>
              hsbToHex(212, sat, b),
            );
            return (
              <div
                key={sat}
                className={styles["bg-stack"]}
                style={{ backgroundColor: base }}
              >
                <div
                  className={styles["bg-layer"]}
                  style={{ backgroundColor: raised }}
                >
                  <div
                    className={styles["bg-layer"]}
                    style={{ backgroundColor: overlay }}
                  >
                    <span className={styles.label}>overlay {overlay}</span>
                  </div>
                  <span className={styles.label}>raised {raised}</span>
                </div>
                <span className={styles.label}>
                  S={sat} · base {base}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h2>系统色</h2>
        <p className={styles.label}>
          书 p.135 原值 + 你的档位。实测：当边框/图标（档位
          45）都够，当文字（档位 75）都不够
        </p>
        {SYSTEM.map((tone) => (
          <div key={tone}>
            <Swatches
              tokens={[
                `--text-${tone}`,
                `--stroke-strong-${tone}`,
                `--stroke-weak-${tone}`,
                `--fill-${tone}`,
              ]}
            />
            <div className={styles.row}>
              {/* 用法示范：边框 + 底色 + 图标上色，消息文字走 text-strong */}
              <div
                className={styles["system-sample"]}
                style={{
                  borderColor: `var(--stroke-strong-${tone})`,
                  backgroundColor: `var(--fill-${tone})`,
                }}
              >
                <span style={{ color: `var(--text-${tone})` }}>●</span>
                <span>消息文字用 text-strong</span>
                <span style={{ color: `var(--text-${tone})` }}>
                  这行用 text-{tone}，看能不能读
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2>品牌色</h2>
        <Swatches tokens={BRAND} />
      </section>

      <section className={styles.section}>
        <h2>stroke-strong-brand 候选透明度</h2>
        <div className={styles.swatches}>
          {[80, 70, 60, 50, 40].map((a) => (
            <div key={a} className={styles.swatch}>
              <div
                className={styles.chip}
                style={{
                  border: `2px solid rgb(from var(--text-brand) r g b / ${a}%)`,
                }}
              />
              <span className={styles.label}>{a}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>前景（透明）</h2>
        <Swatches tokens={FOREGROUND} />
      </section>

      <section className={styles.section}>
        <h2>背景层（实色）</h2>
        <Swatches tokens={SURFACE} />
      </section>

      <section className={`${styles.section} ${styles.type}`}>
        <h2>字号</h2>
        {TYPE.map(([name, token]) => (
          <p
            key={name}
            style={{
              fontSize: `var(${token})`,
              lineHeight: `var(--leading-${name})`,
            }}
          >
            {name} —— 繁荣宇宙 Prosperous Universe 0123
          </p>
        ))}
        <p style={{ color: "var(--text-weak)" }}>
          text-weak 正文 —— 繁荣宇宙 Prosperous Universe
        </p>
        <p>
          正文里的<a href="#">文字链接</a>，以及 <code>行内代码</code>。
        </p>
      </section>

      <section className={styles.section}>
        <h2>间距 / 圆角</h2>
        <div className={styles.row}>
          {SPACE.map((s) => (
            <div key={s}>
              <div
                className={styles.chip}
                style={{
                  width: `var(--space-${s})`,
                  backgroundColor: "var(--stroke-strong)",
                }}
              />
              <span className={styles.label}>{s}</span>
            </div>
          ))}
        </div>
        <div className={styles.row}>
          {["s", "m", "l"].map((r) => (
            <div key={r}>
              <div
                className={styles.chip}
                style={{
                  width: "80px",
                  backgroundColor: "var(--fill-brand)",
                  border: "1px solid var(--stroke-strong)",
                  borderRadius: `var(--radius-${r})`,
                }}
              />
              <span className={styles.label}>radius-{r}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Swatches({ tokens }: { tokens: string[] }) {
  return (
    <div className={styles.swatches}>
      {tokens.map((token) => (
        <div key={token} className={styles.swatch}>
          <div
            className={styles.chip}
            style={{ backgroundColor: `var(${token})` }}
          />
          <span className={styles.label}>{token}</span>
        </div>
      ))}
    </div>
  );
}
