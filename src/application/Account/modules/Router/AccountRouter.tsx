import React from "react";
import { Switch, useRouteMatch, Route } from "react-router";
import Suspense from "../../../../components/modules/Suspense/Suspense";
import NotFound from "../../../../components/modules/NotFound/NotFound";
import Account from "../../navigation/Account/Account";
import Authorizations from "../../navigation/Authorizations/Authorizations";

const AccountRouter = (): React.ReactElement => {
  const baseURL: string = useRouteMatch().path;

  return (
    <React.Suspense fallback={<Suspense />}>
      <Switch>
        <Route path={baseURL} exact component={Account} />
        <Route path={`${baseURL}/authorizations`} component={Authorizations} />
        <Route path="*" exact component={NotFound} />
      </Switch>
    </React.Suspense>
  );
};

export default AccountRouter;
