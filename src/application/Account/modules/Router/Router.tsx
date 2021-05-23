import React, { lazy, FC, Suspense } from "react";
import { Switch, useRouteMatch, Route } from "react-router";
import { SuspenseComponent } from "@components/modules";

const Account = lazy(() => import("../../sections/Account/Account"));
const Authorizations = lazy(
  () => import("../../sections/Authorizations/Authorizations")
);
const Settings = lazy(() => import("../../sections/Settings/Settings"));
const NotFound = lazy(() => import("@components/modules/NotFound/NotFound"));

const Router: FC = () => {
  const { path: baseURL } = useRouteMatch();

  return (
    <Suspense fallback={<SuspenseComponent />}>
      <Switch>
        <Route path={baseURL} exact component={Account} />
        <Route
          path={`${baseURL}/authorizations`}
          exact
          component={Authorizations}
        />
        <Route path={`${baseURL}/settings`} exact component={Settings} />
        <Route path="*" exact component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default Router;
