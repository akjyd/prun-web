import type { Bank, LoanType } from "./types";
import styles from "./BankTable.module.css";
import BankDetail from "./BankDetail";
import { COLUMN_COUNT } from "./columns";
import ChevronRight from "../../ui/icons/ChevronRight";
import EllipsisVertical from "../../ui/icons/EllipsisVertical";
import Flag from "../../ui/icons/Flag";
import Pencil from "../../ui/icons/Pencil";
import Trash from "../../ui/icons/Trash";
import Menu from "../../ui/menu/Menu";
import MenuItem from "../../ui/menu/MenuItem";

const LOAN_TYPE_LABEL: Record<LoanType, string> = {
  stable: "稳定",
  interest: "利息",
};

/** 没有值时表格里统一显示这个，避免出现空白单元格 */
const UNKNOWN = "—";

/** 货币种类总数，全选时显示"全部" */
const CURRENCY_COUNT = 4;

/**
 * 一家银行 = 一个 tbody，里面摘要行 + 详情行。
 *
 * 展开状态由 BankTable 持有，这里只接收 open 和 onToggle。
 */
export default function BankRow({
  bank,
  open,
  onToggle,
}: {
  bank: Bank;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <tbody>
      <tr
        onClick={onToggle}
        className={`${open ? styles.open : ""} ${styles["head-tr"]}`}
      >
        <td className={styles["user-td"]}>
          <div className={styles["user-inner"]}>
            <ChevronRight />
            {bank.user_name}
          </div>
        </td>
        <td>{formatRate(bank)}</td>
        <td>{formatLimit(bank)}</td>
        <td>{formatCurrencies(bank.currency_types)}</td>
        <td>{formatLoanTypes(bank.loan_types)}</td>
        <td className={styles["more-td"]} onClick={(e) => e.stopPropagation()}>
          <Menu
            trigger={<EllipsisVertical />}
            triggerClassName={`${styles.more}`}
          >
            <MenuItem>
              <Pencil />
              编辑条目
            </MenuItem>
            <MenuItem>
              <Flag />
              反馈问题
            </MenuItem>
            <hr />
            <MenuItem variant="danger">
              <Trash />
              删除条目
            </MenuItem>
          </Menu>
        </td>
      </tr>
      <tr>
        <td colSpan={COLUMN_COUNT}>
          {/* 三层各管一件事：grid-container 做动画，clip 做裁剪，detail 做布局 */}
          <div
            className={`${styles["grid-container"]} ${open ? styles.open : ""}`}
          >
            <div className={styles.clip}>
              <BankDetail bank={bank} />
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  );
}

function formatLoanTypes(types: LoanType[] | null): string {
  if (types === null || types.length === 0) return UNKNOWN;
  return types.map((t) => LOAN_TYPE_LABEL[t]).join(" / ");
}

/** 显示货币种类或者"全部" */
function formatCurrencies(currencies: string[] | null): string {
  if (currencies === null || currencies.length === 0) return UNKNOWN;
  if (currencies.length === CURRENCY_COUNT) return "全部";

  return currencies.join(" / ");
}

/** 定值显示单值 范围值显示范围 */
function formatRate(bank: Bank): string {
  const { rate_min, rate_max } = bank;

  if (rate_min === null || rate_max === null) return UNKNOWN;
  if (rate_min === rate_max) return `${rate_min}%`;

  return `${rate_min}% - ${rate_max}%`;
}

/** 三种状态：无上限 / 有具体数字 / 还没填 */
function formatLimit(bank: Bank): string {
  if (bank.no_limit) return "无上限";
  if (bank.credit_limit === null) return UNKNOWN;

  return bank.credit_limit + "M";
}
