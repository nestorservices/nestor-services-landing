import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (rootElement?.hasAttribute("data-prerendered-homepage")) {
  // The homepage snapshot is generated as HTML, not React markup, so mount instead of hydrating it.
  ReactDOM.createRoot(rootElement).render(app);
} else if (rootElement?.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  ReactDOM.createRoot(rootElement).render(app);
}
