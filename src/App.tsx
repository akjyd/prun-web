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
 */
import { Route, Routes } from "react-router";
import Header from "./components/Header";
import Home from "./routes/Home";
import Content from "./components/Content";
import NotFound from "./components/NotFound";
import DocsLayout from "./routes/DocsLayout";
import SectionIndex from "./components/SectionIndex";
import { OpenGroupsProvider } from "./contexts/OpenGroupsProvider";

function App() {
  return (
    <>
      <Header />
      <OpenGroupsProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:section" element={<DocsLayout />}>
            <Route index element={<SectionIndex />} />
            <Route path=":slug" element={<Content />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </OpenGroupsProvider>
    </>
  );
}

export default App;
