import { Route, Routes } from "react-router";
import Header from "./components/Header";
import Home from "./routes/Home";
import TutorialHome from "./routes/TutorialHome";
import ReferenceHome from "./routes/ReferenceHome";
import Content from "./components/Content";
import NotFound from "./components/NotFound";
import DocsLayout from "./routes/DocsLayout";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tutorial" element={<DocsLayout section="tutorial" />}>
          <Route index element={<TutorialHome />} />
          <Route path=":slug" element={<Content />} />
        </Route>
        <Route path="/reference" element={<DocsLayout section="reference" />}>
          <Route index element={<ReferenceHome />} />
          <Route path=":slug" element={<Content />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
