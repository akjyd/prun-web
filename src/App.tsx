import { Route, Routes, useLocation } from "react-router";
import { useState } from "react";
import Header from "./layout/Header";
import Home from "./routes/Home";
import Article from "./routes/Article";
import NotFound from "./routes/NotFound";
import DocsLayout from "./routes/DocsLayout";
import SectionIndex from "./routes/SectionIndex";
import { OpenGroupsProvider } from "./contexts/openGroups/OpenGroupsProvider";
import Kitchen from "./routes/Kitchen";
import AuthContextProvider from "./contexts/auth/AuthContextProvider";
import AppOverlays from "./layout/AppOverlays";
import ToastContextProvider from "./contexts/toast/ToastContextProvider";

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
    <ToastContextProvider>
      <AuthContextProvider>
        <Header menuOpen={menuOpen} onMenuToggle={handleMenuToggle} />
        <AppOverlays />
        <OpenGroupsProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            {import.meta.env.DEV && (
              <Route path="/kitchen" element={<Kitchen />} />
            )}
            <Route
              path="/:section"
              element={
                <DocsLayout
                  menuOpen={menuOpen}
                  onMenuToggle={handleMenuToggle}
                />
              }
            >
              <Route index element={<SectionIndex />} />
              <Route path=":slug" element={<Article />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </OpenGroupsProvider>
      </AuthContextProvider>
    </ToastContextProvider>
  );

  function handleMenuToggle() {
    setMenuOpen((open) => !open);
  }
}

export default App;
