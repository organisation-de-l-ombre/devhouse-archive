import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Suspense from "./components/modules/Suspense/Suspense";

const IMRMain = React.lazy(() => import("./IMRMain"));

const RootComponent = (): React.ReactElement => {
  return (
    <React.StrictMode>
      <React.Suspense fallback={<Suspense />}>
        <IMRMain />
      </React.Suspense>
    </React.StrictMode>
  );
};
const app = document.createElement("div");
app.id = "app";
document.body.appendChild(app);

ReactDOM.render(<RootComponent />, app);
