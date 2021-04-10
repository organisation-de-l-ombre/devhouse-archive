import React from "react";
import { Switch, useRouteMatch, Route } from "react-router";
import { Suspense } from "@components/modules";

const Account = React.lazy(() => import("../../sections/Account/Account"));
const Authorizations = React.lazy(
  () => import("../../sections/Authorizations/Authorizations")
);
const Settings = React.lazy(() => import("../../sections/Settings/Settings"));
const NotFound = React.lazy(
  () => import("@components/modules/NotFound/NotFound")
);

const AccountRouter = (): React.ReactElement => {
  const baseURL: string = useRouteMatch().path;

  return (
    <React.Suspense fallback={<Suspense />}>
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
    </React.Suspense>
  );
};

export default AccountRouter;
