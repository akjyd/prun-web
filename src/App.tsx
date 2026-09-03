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
