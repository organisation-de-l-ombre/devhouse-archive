import React from "react";
import { Switch, Route } from "react-router-dom";
import { useRouteMatch } from "react-router";
import { Suspense } from "@components/modules";

const WikiSection = React.lazy(() => import("../../sections/WikiSection"));
const NotFound = React.lazy(
  () => import("../../../../../components/modules/NotFound/NotFound")
);

const Router = (): React.ReactElement => {
  const { path: baseURL, params } = useRouteMatch();

  return (
    <React.Suspense fallback={<Suspense />}>
      <Switch>
        <Route path={baseURL} exact>
          <WikiSection
            type="internal"
            section={(params as Record<string, string>).section}
          />
        </Route>
        <Route path="*" exact component={NotFound} />
      </Switch>
    </React.Suspense>
  );
};

export default Router;
