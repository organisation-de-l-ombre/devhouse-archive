import React from "react";
import { Switch, useLocation, Route } from "react-router";
import Suspense from "../../../../components/Suspense/Suspense";
import Movie from "../../navigation/Movie/Movie";
import NotFound from "../../../../components/NotFound/NotFound";

const MovieRouter = (): React.ReactElement => {
  const baseURL: string = useLocation().pathname;

  return (
    <React.Suspense fallback={<Suspense />}>
      <Switch>
        <Route path={baseURL} exact component={Movie} />
        <Route path="*" component={NotFound} />
      </Switch>
    </React.Suspense>
  );
};

export default MovieRouter;
