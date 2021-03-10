import React from "react";
import flexContainerStyles from "../../components/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../themes/Global.module.scss";
import FlexContainer from "../../components/FlexContainer/FlexContainer";
import MovieHeaders from "./modules/MovieHeaders/MovieHeaders";
import MovieInternalNavigation from "./modules/MovieInternalNavigation/MovieInternalNavigation";
import MovieRouter from "./modules/Router/MovieRouter";

const MoviePrototype = (): React.ReactElement => {
  return (
    <FlexContainer
      className={`${flexContainerStyles.container} ${globalStyles.column}`}
    >
      <MovieHeaders />
      <MovieInternalNavigation />
      <MovieRouter />
    </FlexContainer>
  );
};

export default MoviePrototype;
