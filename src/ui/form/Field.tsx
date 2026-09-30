import fieldStyles from "./FieldBase.module.css";
import styles from "./Field.module.css";
import OctagonX from "../icons/OctagonX";

export default function Field({
  className = "",
  label = "",
  as = "label",
  hint,
  errorHint,
  required,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  /**名称 */
  label: string;
  /**包裹的标签 */
  as?: "label" | "div";
  /**提示 */
  hint?: string;
  /**必填选项 */
  required?: boolean;
  /**错误提示 */
  errorHint?: string;
}) {
  const Tag = as;

  return (
    <Tag
      {...props}
      data-invalid={errorHint ? "" : undefined}
      className={`${className} ${fieldStyles.field} ${styles.label}`}
    >
      <span className={fieldStyles.name}>
        {label}
        {required && "*"}
      </span>
      <div className={fieldStyles.messages}>
        {hint && <span className={fieldStyles.hint}>{hint}</span>}
        {errorHint && (
          <span className={fieldStyles["error-hint"]}>
            <OctagonX /> {errorHint}
          </span>
        )}
      </div>
      {children}
    </Tag>
  );
}
