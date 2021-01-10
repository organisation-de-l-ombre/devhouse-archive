import React from "react";
import ReactDOM from "react-dom";
import App from "./pages/App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import "./languages/i18n";

const app = document.createElement("div");

app.id = "app";
document.body.appendChild(app);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  app
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
