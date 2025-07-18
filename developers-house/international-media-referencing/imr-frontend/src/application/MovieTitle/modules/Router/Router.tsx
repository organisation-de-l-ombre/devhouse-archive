import React, { FC } from "react";
import { Switch, useRouteMatch, Route } from "react-router";
import loadable from "@loadable/component";
import { MovieTitleSuccess } from "@store/movieTitle/types";
import { SuspenseComponent } from "@components/modules";

const WatchModule = loadable(() => import("../../sections/Watch/Watch"));
const MovieSection = loadable(() => import("../../sections/Movie/Movie"));
const CharactersSection = loadable(
  () => import("../../sections/Characters/Characters")
);
const CastingSection = loadable(() => import("../../sections/Casting/Casting"));
const VideosSection = loadable(() => import("../../sections/Videos/Videos"));
const OSTSection = loadable(() => import("../../sections/OST/OST"));
const TechnicalSpecsSection = loadable(
  () => import("../../sections/TechnicalSpecs/TechnicalSpecs")
);
const NotFound = loadable(
  () => import("@components/modules/NotFound/NotFound")
);

const Router: FC<{ dataResponse: MovieTitleSuccess }> = ({ dataResponse }) => {
  const { url: baseURL } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${baseURL}/watch`} exact>
        <WatchModule
          fallback={<SuspenseComponent minHeight />}
          dataResponse={dataResponse}
        />
      </Route>
      <Route path={baseURL} exact>
        <MovieSection
          fallback={<SuspenseComponent minHeight />}
          dataResponse={dataResponse}
        />
      </Route>
      <Route path={`${baseURL}/characters`} exact>
        <CharactersSection
          fallback={<SuspenseComponent minHeight />}
          dataResponse={dataResponse}
        />
      </Route>
      <Route path={`${baseURL}/casting`} exact>
        <CastingSection
          fallback={<SuspenseComponent minHeight />}
          dataResponse={dataResponse}
        />
      </Route>
      <Route path={`${baseURL}/videos`} exact>
        <VideosSection
          fallback={<SuspenseComponent minHeight />}
          dataResponse={dataResponse}
        />
      </Route>
      <Route path={`${baseURL}/ost`} exact>
        <OSTSection
          fallback={<SuspenseComponent minHeight />}
          dataResponse={dataResponse}
        />
      </Route>
      <Route path={`${baseURL}/technical-specs`} exact>
        <TechnicalSpecsSection
          fallback={<SuspenseComponent minHeight />}
          dataResponse={dataResponse}
        />
      </Route>
      <Route path="*" exact component={NotFound} />
    </Switch>
  );
};

export default Router;
