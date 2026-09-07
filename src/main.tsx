import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
// 顺序即层叠顺序：变量最先，断点最后（断点靠"后来者胜"覆盖同特异度的规则）
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/markdown.css";
import "./styles/responsive.css";
import App from "./App.tsx";

import "@fontsource-variable/inter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
