import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
// layer-order.css 必须第一个用于声明层序
import "./styles/layer-order.css";
import "./styles/layer-map.css";
import App from "./App.tsx";

import "@fontsource-variable/inter";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
