import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/footer.css";
import "./styles/common.css";
import "./styles/home.css";
import "./styles/detect.css";
import "./styles/compare.css";
import "./styles/analytics.css";
import "./styles/history.css";
import "./styles/developer.css";
import "./styles/responsive.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
