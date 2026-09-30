import styles from "./Menu.module.css";
import { useId, type ReactNode } from "react";

export default function Menu({
  trigger,
  triggerClassName = "",
  children,
}: {
  trigger: ReactNode;
  triggerClassName?: string;
  children: ReactNode;
}) {
  const id = useId();

  return (
    <>
      <button popoverTarget={id} className={` ${triggerClassName}`}>
        {trigger}
      </button>
      <div id={id} popover="auto" className={`${styles.menu}`}>
        {children}
      </div>
    </>
  );
}
