import React from "react";
import { Switch, useRouteMatch, Route } from "react-router";
import Suspense from "../../../../components/Suspense/Suspense";
import Movie from "../../navigation/Movie/Movie";
import NotFound from "../../../../components/NotFound/NotFound";
import Videos from "../../navigation/Videos/Videos";
import { MovieObject } from "../../Types";
import OST from "../../navigation/OST/OST";
import FlexContainer from "../../../../components/FlexContainer/FlexContainer";
import flexContainerStyles from "../../../../components/FlexContainer/FlexContainer.module.scss";
import styles from "./MovieRouter.module.scss";

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
          <Movie dataResponse={dataResponse} />
        </Route>
        <Route path={`${baseURL}/videos`} exact>
          <Videos dataResponse={dataResponse} />
        </Route>
        <Route path={`${baseURL}/ost`} exact>
          <OST dataResponse={dataResponse} />
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
