/**
 * 搜索入口：顶栏按钮 + 弹窗外壳 + 输入框。
 *
 * 结果列表走懒加载 —— 搜索引擎（MiniSearch + 拼音词典）占了整个产物的
 * 一大半，而多数访客根本不会点搜索。首屏不该为它买单。
 */
import { lazy, Suspense, useDeferredValue, useRef, useState } from "react";

//必须写在组件外面：写在里面每次渲染都会造一个新的组件类型，导致反复重挂载
const SearchResults = lazy(() => import("./SearchResults"));

export default function SearchBox() {
  const [query, setQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  //输入框用 query 保持跟手，搜索用滞后的值，避免每敲一个字都卡一下
  const deferredQuery = useDeferredValue(query);

  return (
    <>
      <button onClick={handleButton} onMouseEnter={preload}>
        搜索
      </button>
      <dialog
        ref={dialogRef}
        className="dialog"
        onClick={handleDialog}
        onClose={() => setIsOpen(false)}
      >
        <input
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          value={query}
        />
        {isOpen && (
          <Suspense fallback={<div>搜索加载中…</div>}>
            <SearchResults query={deferredQuery} />
          </Suspense>
        )}
      </dialog>
    </>
  );

  //鼠标移到按钮上就开始下载，等真点下去往往已经好了。
  //import() 是幂等的，重复调用拿到同一个 Promise，不用判断加载过没有
  function preload() {
    void import("./SearchResults");
  }

  function handleButton() {
    const dialog = dialogRef.current;
    if (dialog === null) return;

    dialog.showModal();
    setIsOpen(true);
  }

  function handleDialog(e: React.MouseEvent<HTMLDialogElement>) {
    //点遮罩层时事件的 target 是 dialog 自身，点内容时是内部元素 ——
    //以此区分「点了外面」和「点了里面」。
    //这里只负责关，isOpen 交给 onClose 统一维护：Esc 键关闭不走这条路径。
    if (e.target === dialogRef.current) dialogRef.current.close();
  }
}
