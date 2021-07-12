import React, { FC } from "react";
import { Switch, useRouteMatch, Route } from "react-router";
import loadable from "@loadable/component";

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

const Router: FC = () => {
  const { url: baseURL } = useRouteMatch();

  return (
    <Switch>
      <Route path={baseURL} exact component={MovieSection} />
      <Route path={`${baseURL}/casting`} exact component={CastingSection} />
      <Route
        path={`${baseURL}/characters`}
        exact
        component={CharactersSection}
      />
      <Route path={`${baseURL}/videos`} exact component={VideosSection} />
      <Route path={`${baseURL}/ost`} exact component={OSTSection} />
      <Route
        path={`${baseURL}/technicalSpecs`}
        exact
        component={TechnicalSpecsSection}
      />
      <Route path="*" exact component={NotFound} />
    </Switch>
  );
};

export default Router;
