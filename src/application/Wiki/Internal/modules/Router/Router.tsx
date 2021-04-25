import React from "react";
import { Switch, Route } from "react-router-dom";
import { useRouteMatch } from "react-router";
import { Suspense } from "@components/modules";

const Intro = React.lazy(() => import("../../sections/Intro/Intro"));
const NotFound = React.lazy(
  () => import("../../../../../components/modules/NotFound/NotFound")
);

const Router = (): React.ReactElement => {
  const { path: baseURL } = useRouteMatch();

  return (
    <React.Suspense fallback={<Suspense />}>
      <Switch>
        <Route path={baseURL} exact component={Intro} />
        <Route path="*" exact component={NotFound} />
      </Switch>
    </React.Suspense>
  );
};

export default Router;
