import React from "react";
import { Switch, useRouteMatch, Route } from "react-router";
import Suspense from "../../../../components/modules/Suspense/Suspense";
import MovieSection from "../../sections/Movie/Movie";
import NotFound from "../../../../components/modules/NotFound/NotFound";
import VideosSection from "../../sections/Videos/Videos";
import OSTSection from "../../sections/OST/OST";
import FlexContainer from "../../../../components/ui/FlexContainer/FlexContainer";
import flexContainerStyles from "../../../../components/ui/FlexContainer/FlexContainer.module.scss";
import styles from "./MovieRouter.module.scss";
import CastingSection from "../../sections/Casting/Casting";
import CharactersSection from "../../sections/Characters/Characters";
import { S3DataResponse } from "../../types";
import SectionEmpty from "../SectionEmpty/SectionEmpty";

const MovieRouter: React.FC<{ dataResponse: S3DataResponse }> = ({
  dataResponse,
}) => {
  const baseURL: string = useRouteMatch().path;

  React.useEffect(() => {
    document.title = `${dataResponse.title} - IMR`;

    return () => {
      document.title = "IMR";
    };
  });

  return (
    <React.Suspense fallback={<Suspense />}>
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
          <FlexContainer
            className={`${flexContainerStyles.container} ${styles.container}`}
          >
            <NotFound />
          </FlexContainer>
        </Route>
      </Switch>
    </React.Suspense>
  );
};

export default MovieRouter;
