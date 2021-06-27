import React, { Suspense } from "react";
import { Switch, useRouteMatch, Route } from "react-router";
import { SuspenseComponent } from "@components/modules";
import loadable from "@loadable/component";
import { ReactMovieElement } from "../../types";

const MovieSection = loadable(() => import("../../sections/Movie/Movie"));
const CastingSection = loadable(() => import("../../sections/Casting/Casting"));
const CharactersSection = loadable(
  () => import("../../sections/Characters/Characters")
);
const VideosSection = loadable(() => import("../../sections/Videos/Videos"));
const OSTSection = loadable(() => import("../../sections/OST/OST"));
const TechnicalSpecsSection = loadable(
  () => import("../../sections/TechnicalSpecs/TechnicalSpecs")
);
const NotFound = loadable(
  () => import("@components/modules/NotFound/NotFound")
);

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
