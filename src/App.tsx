import { Route, Routes } from "react-router";
import Home from "./routes/Home";
import Tutorial from "./routes/Tutorial";
import Reference from "./routes/Reference";
import Article from "./routes/Article";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/reference" element={<Reference />} />
        <Route path="/tutorial/:slug" element={<Article />} />
      </Routes>
    </>
  );
}

export default App;
//
