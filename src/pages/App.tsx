import { BrowserRouter, Route, Switch } from "react-router-dom";
import React from "react";
import "../App.css";

const Home = React.lazy(() => import("./Home/Home"));

export default function App(): React.ReactElement {
  return (
    <React.Suspense fallback={<></>}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
        </Switch>
      </BrowserRouter>
    </React.Suspense>
  );
}
