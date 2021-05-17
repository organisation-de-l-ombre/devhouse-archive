import React from "react";
import { Switch, useRouteMatch, Route } from "react-router";
import { Suspense } from "@components/modules";
import { ReactMovieElement } from "../../types";

const MovieSection = React.lazy(() => import("../../sections/Movie/Movie"));
const CastingSection = React.lazy(
  () => import("../../sections/Casting/Casting")
);
const CharactersSection = React.lazy(
  () => import("../../sections/Characters/Characters")
);
const VideosSection = React.lazy(() => import("../../sections/Videos/Videos"));
const OSTSection = React.lazy(() => import("../../sections/OST/OST"));
const TechnicalSpecsSection = React.lazy(
  () => import("../../sections/TechnicalSpecs/TechnicalSpecs")
);
const NotFound = React.lazy(
  () => import("@components/modules/NotFound/NotFound")
);

const Router: ReactMovieElement = ({ dataResponse }) => {
  const { url: baseURL } = useRouteMatch();

  return (
    <React.Suspense fallback={<Suspense minHeight />}>
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
    </React.Suspense>
  );
};

export default Router;
