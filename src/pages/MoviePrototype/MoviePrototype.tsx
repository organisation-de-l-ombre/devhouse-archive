import React from "react";
import flexContainerStyles from "../../components/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../themes/Global.module.scss";
import FlexContainer from "../../components/FlexContainer/FlexContainer";
import MovieHeaders from "./modules/MovieHeaders/MovieHeaders";
import MovieInternalNavigation from "./modules/MovieInternalNavigation/MovieInternalNavigation";
import MovieRouter from "./modules/Router/MovieRouter";

const MoviePrototype = (): React.ReactElement => {
  const [scroll, setScroll] = React.useState<boolean>(false);
  const scrollSpy = (): void => {
    if ((window.scrollY > 525 && !scroll) || (window.scrollY < 525 && scroll)) {
      setScroll(!scroll);
    }
  };

  window.addEventListener("scroll", scrollSpy);

  return (
    <FlexContainer
      className={`${flexContainerStyles.container} ${globalStyles.column}`}
    >
      <MovieHeaders />
      <MovieInternalNavigation scroll={scroll} />
      <MovieRouter />
    </FlexContainer>
  );
};

export default MoviePrototype;
