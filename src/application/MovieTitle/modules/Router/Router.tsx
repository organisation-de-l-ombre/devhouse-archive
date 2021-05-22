import React, { lazy, Suspense } from "react";
import { Switch, useRouteMatch, Route } from "react-router";
import { SuspenseComponent } from "@components/modules";
import { ReactMovieElement } from "../../types";

const MovieSection = lazy(() => import("../../sections/Movie/Movie"));
const CastingSection = lazy(() => import("../../sections/Casting/Casting"));
const CharactersSection = lazy(
  () => import("../../sections/Characters/Characters")
);
const VideosSection = lazy(() => import("../../sections/Videos/Videos"));
const OSTSection = lazy(() => import("../../sections/OST/OST"));
const TechnicalSpecsSection = lazy(
  () => import("../../sections/TechnicalSpecs/TechnicalSpecs")
);
const NotFound = lazy(() => import("@components/modules/NotFound/NotFound"));

const Router: ReactMovieElement = ({ dataResponse }) => {
  const { url: baseURL } = useRouteMatch();

  return (
    <Suspense fallback={<SuspenseComponent minHeight />}>
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
        <Route path={`${baseURL}/technicalSpecs`} exact>
          <TechnicalSpecsSection dataResponse={dataResponse} />
        </Route>
        <Route path="*" exact>
          <NotFound />
        </Route>
      </Switch>
    </Suspense>
  );
};

export default Router;
