/**
 * 搜索入口：顶栏按钮 + 弹窗外壳 + 输入框。
 *
 * 结果列表是懒加载
 */
import React, {
  lazy,
  Suspense,
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import Search from "../../ui/icons/Search";
import IconButton from "../../ui/button/IconButton";
import styles from "./SearchBox.module.css";
import { useNavigate } from "react-router";

//必须写在组件外面：写在里面每次渲染都会造一个新的组件类型，导致反复重挂载
const SearchResults = lazy(() => import("./SearchResults"));

export default function SearchBox() {
  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [active, setActive] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  //输入框用 query 保持跟手，搜索用滞后的值，避免每敲一个字都卡一下
  const deferredQuery = useDeferredValue(query);

  const openDialog = useCallback(() => {
    const dialog = dialogRef.current;
    if (dialog === null || dialog.open) return;

    dialog.showModal();
    setIsOpen(true);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        const dialog = dialogRef.current;
        if (dialog === null) return;

        if (dialog.open) dialog.close();
        else openDialog();
      } else if (
        e.key === "Enter" &&
        dialogRef.current?.open &&
        !e.isComposing &&
        active !== undefined
      ) {
        e.preventDefault();

        dialogRef.current.close();
        navigate(active);
      }
    }
  }, [openDialog, active, navigate]);

  return (
    <>
      <IconButton className={styles.trigger} onClick={openDialog} onMouseEnter={preload}>
        <Search />
        <kbd className={styles.kbd}>Ctrl K</kbd>
      </IconButton>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClick={handleDialog}
        onClose={() => setIsOpen(false)}
      >
        <div className={styles.panel}>
          <input
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            value={query}
            placeholder="搜索"
          />
          {isOpen && (
            <Suspense
              fallback={<div>搜索加载中…</div>}
            >
              <SearchResults
                deferredQuery={deferredQuery}
                active={active}
                onActiveChange={onActiveChange}
                dialogRef={dialogRef}
              />
            </Suspense>
          )}
        </div>
      </dialog>
    </>
  );

  function preload() {
    void import("./SearchResults");
  }

  function handleDialog(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) dialogRef.current.close();
  }

  function onActiveChange(url: string) {
    setActive(url);
  }
}
