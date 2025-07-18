import React, { lazy, FC, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { useRouteMatch } from "react-router";
import { SuspenseComponent } from "@components/modules";

const WikiSection = lazy(() => import("../../sections/WikiSection"));
const NotFound = lazy(
  () => import("../../../../../components/modules/NotFound/NotFound")
);

const Router: FC = () => {
  const { path: baseURL, params } = useRouteMatch();

  return (
    <Suspense fallback={<SuspenseComponent />}>
      <Switch>
        <Route path={baseURL} exact>
          <WikiSection
            type="internal"
            section={(params as Record<string, string>).section}
          />
        </Route>
        <Route path="*" exact component={NotFound} />
      </Switch>
    </Suspense>
  );
};

export default Router;
