import React from "react";
import { Switch, useRouteMatch, Route } from "react-router";
import { Suspense } from "@components/modules";
import { S3DataResponse } from "../../types";
import SectionEmpty from "../SectionEmpty/SectionEmpty";
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

const MovieRouter: React.FC<{ dataResponse: S3DataResponse }> = ({
  dataResponse,
}) => {
  const { url: baseURL } = useRouteMatch();

  React.useEffect(() => {
    document.title = `${dataResponse.title} - IMR`;

    return () => {
      document.title = "IMR";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Suspense fallback={<Suspense className={containerStyle.loading} />}>
      <Switch>
        <Route path={baseURL} exact>
          <MovieSection dataResponse={dataResponse} />
        </Route>
        <Route path={`${baseURL}/casting`} exact>
          {dataResponse.casting ? (
            <CastingSection dataResponse={dataResponse} />
          ) : (
            <SectionEmpty />
          )}
        </Route>
        <Route path={`${baseURL}/characters`} exact>
          {dataResponse.characters ? (
            <CharactersSection dataResponse={dataResponse} />
          ) : (
            <SectionEmpty />
          )}
        </Route>
        <Route path={`${baseURL}/videos`} exact>
          {dataResponse.videos ? (
            <VideosSection dataResponse={dataResponse} />
          ) : (
            <SectionEmpty />
          )}
        </Route>
        <Route path={`${baseURL}/ost`} exact>
          {dataResponse.ost ? (
            <OSTSection dataResponse={dataResponse} />
          ) : (
            <SectionEmpty />
          )}
        </Route>
        <Route path={`${baseURL}/technical-specs`} exact>
          {dataResponse.technicalSpecs ? <></> : <SectionEmpty />}
        </Route>
        <Route path="*" exact>
          <NotFound className={containerStyle.loading} />
        </Route>
      </Switch>
    </React.Suspense>
  );
};

export default MovieRouter;
