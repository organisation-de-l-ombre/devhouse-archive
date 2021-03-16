import React from "react";
import { RouteComponentProps } from "react-router";
import flexContainerStyles from "../../components/ui/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../themes/Global.module.scss";
import FlexContainer from "../../components/ui/FlexContainer/FlexContainer";
import MovieHeaders from "./modules/MovieHeaders/MovieHeaders";
import MovieInternalNavigation from "./modules/MovieInternalNavigation/MovieInternalNavigation";
import MovieRouter from "./modules/Router/MovieRouter";
import NotFound from "../../components/modules/NotFound/NotFound";
import { MovieObject } from "./Types";

const MovieRoot: React.FC<RouteComponentProps> = ({ match }) => {
  const JSONResponse: MovieObject = React.useMemo(
    () =>
      require(`./prototypes/${
        (match.params as Record<string, unknown>).title
      }`),
    [match.params]
  );

  if (!JSONResponse) {
    return <NotFound />;
  }

  return (
    <FlexContainer
      className={`${flexContainerStyles.container} ${globalStyles.column}`}
    >
      <MovieHeaders dataResponse={JSONResponse} />
      <MovieInternalNavigation dataResponse={JSONResponse} />
      <MovieRouter dataResponse={JSONResponse} />
    </FlexContainer>
  );
};

export default MovieRoot;
