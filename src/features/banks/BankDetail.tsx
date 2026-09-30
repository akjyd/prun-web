import type { Bank } from "./types";
import styles from "./BankTable.module.css";
import ButtonLink from "../../ui/button/ButtonLink";

/**
 * 展开后的详情内容。
 *
 * 左边补充信息（块数和长度都不定，交给 auto-fit 分列），
 * 右边链接和联系方式（有上界，按内容宽度）。
 */
export default function BankDetail({ bank }: { bank: Bank }) {
  const id = bank.created_by === null ? undefined : `记录ID ${bank.created_by}`;

  const updated =
    bank.updated_at === null
      ? undefined
      : `更新于 ${new Date(bank.updated_at).toLocaleDateString("zh-CN")}`;

  return (
    <div className={styles["detail-container"]}>
      {bank.extra_notes !== null && (
        <div className={styles.notes}>
          {bank.extra_notes.map((note) => (
            <div className={styles.note} key={note.title}>
              <div className={styles["note-title"]}>{note.title}</div>
              {note.text !== undefined && (
                <p className={styles["note-text"]}>{note.text}</p>
              )}
              <ul className={styles["note-items"]}>
                {note.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className={styles.aside}>
        <div>
          {bank.discord_link !== null && (
            <ButtonLink href={bank.discord_link} variant="secondary">
              前往 discord 查看
            </ButtonLink>
          )}
          <div className={styles.meta}>
            {id}
            {id && updated ? "·" : undefined}
            {updated}
          </div>
        </div>

        <ul className={styles["ex-links-ul"]}>
          {bank.extra_links?.map((link) => (
            <li key={link.name}>
              <a href={link.link}>{link.name}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
