/**
 * 全站路由骨架。
 *
 * 分区不写死：`/:section` 是动态段，分区由 src/contents/ 下的目录结构
 * 决定，新增一个分区不用改这里。
 *
 * 访问 /tutorial 这样的分区根路径时，index 路由会重定向到该分区的
 * 第一篇文章 —— 没有单独的分区着陆页。
 *
 * OpenGroupsProvider 包在 Routes 外面：它持有左栏的开合状态，
 * 要活得比任何一条路由久。
 *
 * 抽屉的开合状态 menuOpen 住在这里：开关按钮在 Header 里，
 * 抽屉本身在 DocsLayout 里，这两个组件最近的共同父级就是 App。
 */
import { Route, Routes, useLocation } from "react-router";
import { useState } from "react";
import Header from "./components/Header";
import Home from "./routes/Home";
import Content from "./components/Content";
import NotFound from "./components/NotFound";
import DocsLayout from "./routes/DocsLayout";
import SectionIndex from "./components/SectionIndex";
import { OpenGroupsProvider } from "./contexts/OpenGroupsProvider";

function App() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const pathname = useLocation().pathname;

  //换了地址就关抽屉。在渲染期间调整而不是用 effect：
  //effect 要等渲染之后才跑，中间会有一帧显示着开着的抽屉
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  return (
    <>
      <Header menuOpen={menuOpen} onMenuToggle={handleMenuToggle} />
      <OpenGroupsProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/:section"
            element={
              <DocsLayout menuOpen={menuOpen} onMenuToggle={handleMenuToggle} />
            }
          >
            <Route index element={<SectionIndex />} />
            <Route path=":slug" element={<Content />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </OpenGroupsProvider>
    </>
  );

  function handleMenuToggle() {
    setMenuOpen((open) => !open);
  }
}

export default App;
