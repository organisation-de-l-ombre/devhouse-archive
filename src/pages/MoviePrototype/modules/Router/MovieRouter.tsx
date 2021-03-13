import React from "react";
import { Switch, useRouteMatch, Route } from "react-router";
import Suspense from "../../../../components/Suspense/Suspense";
import Movie from "../../navigation/Movie/Movie";
import NotFound from "../../../../components/NotFound/NotFound";
import Videos from "../../navigation/Videos/Videos";

const MovieRouter = (): React.ReactElement => {
  const baseURL: string = useRouteMatch().path;

  return (
    <React.Suspense fallback={<Suspense />}>
      <Switch>
        <Route path={baseURL} exact component={Movie} />
        <Route path={`${baseURL}/videos`} exact component={Videos} />
        <Route path="*" exact component={NotFound} />
      </Switch>
    </React.Suspense>
  );
};

export default MovieRouter;
