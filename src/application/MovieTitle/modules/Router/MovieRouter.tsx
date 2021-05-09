import React from "react";
import { Switch, useRouteMatch, Route } from "react-router";
import { Suspense } from "@components/modules";
import { ReactMovieElement } from "../../types";
import containerStyle from "../../Containers.module.scss";

const MovieSection = React.lazy(() => import("../../sections/Movie/Movie"));
const CastingSection = React.lazy(
  () => import("../../sections/Casting/Casting")
);
const CharactersSection = React.lazy(
  () => import("../../sections/Characters/Characters")
);
const VideosSection = React.lazy(() => import("../../sections/Videos/Videos"));
const OSTSection = React.lazy(() => import("../../sections/OST/OST"));
const NotFound = React.lazy(
  () => import("@components/modules/NotFound/NotFound")
);

const MovieRouter: ReactMovieElement = ({ dataResponse }) => {
  const { url: baseURL } = useRouteMatch();

  return (
    <React.Suspense fallback={<Suspense className={containerStyle.loading} />}>
      <Switch>
        <Route path={baseURL} exact>
          <MovieSection dataResponse={dataResponse} />
        </Route>
        <Route path={`${baseURL}/casting`} exact>
          <CastingSection dataResponse={dataResponse} />
        </Route>
        <Route path={`${baseURL}/characters`} exact>
          <CharactersSection dataResponse={dataResponse} />
        </Route>
        <Route path={`${baseURL}/videos`} exact>
          <VideosSection dataResponse={dataResponse} />
        </Route>
        <Route path={`${baseURL}/ost`} exact>
          <OSTSection dataResponse={dataResponse} />
        </Route>
        <Route path={`${baseURL}/technical-specs`} exact>
          <></>
        </Route>
        <Route path="*" exact>
          <NotFound className={containerStyle.loading} />
        </Route>
      </Switch>
    </React.Suspense>
  );
};

export default MovieRouter;
