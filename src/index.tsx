import React from "react";
import ReactDOM from "react-dom";
import { RootSuspense } from "@components/modules";

const IMRMain = React.lazy(() => import("./IMRMain"));

const RootComponent = (): React.ReactElement => {
  return (
    <React.Suspense fallback={<RootSuspense />}>
      <IMRMain />
    </React.Suspense>
  );
};

const app = document.createElement("div");
app.className = "app";
document.body.appendChild(app);

ReactDOM.render(<RootComponent />, app);
