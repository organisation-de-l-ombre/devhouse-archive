import React, { FC } from "react";
import { Switch, useRouteMatch, Route } from "react-router";
import loadable from "@loadable/component";

const Account = loadable(() => import("../../sections/Account/Account"));
const Authorizations = loadable(
  () => import("../../sections/Authorizations/Authorizations")
);
const Settings = loadable(() => import("../../sections/Settings/Settings"));
const NotFound = loadable(
  () => import("@components/modules/NotFound/NotFound")
);

const Router: FC = () => {
  const { path: baseURL } = useRouteMatch();

  return (
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
  );
};

export default Router;
