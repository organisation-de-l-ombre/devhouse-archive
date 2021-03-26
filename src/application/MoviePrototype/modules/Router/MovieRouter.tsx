import React from "react";
import { Switch, useRouteMatch, Route } from "react-router";
import Suspense from "../../../../components/modules/Suspense/Suspense";
import MovieSection from "../../navigation/Movie/Movie";
import NotFound from "../../../../components/modules/NotFound/NotFound";
import VideosSection from "../../navigation/Videos/Videos";
import { MovieObject } from "../../Types";
import OSTSection from "../../navigation/OST/OST";
import FlexContainer from "../../../../components/ui/FlexContainer/FlexContainer";
import flexContainerStyles from "../../../../components/ui/FlexContainer/FlexContainer.module.scss";
import styles from "./MovieRouter.module.scss";
import CastingSection from "../../navigation/Casting/Casting";
import CharactersSection from "../../navigation/Characters/Characters";

const MovieRouter: React.FC<{ dataResponse: MovieObject }> = ({
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
