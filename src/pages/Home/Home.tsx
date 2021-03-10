import React from "react";
import { NavLink } from "react-router-dom";
import FlexContainer from "../../components/FlexContainer/FlexContainer";
import flexContainerStyles from "../../components/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../themes/Global.module.scss";
import buttonStyles from "../../components/Button/Button.module.scss";

const Home = (): React.ReactElement => {
  return (
    <FlexContainer
      className={`${flexContainerStyles.container} ${globalStyles["alignment-full-center"]}`}
    >
      <NavLink
        to="/movies/title/tangled"
        className={buttonStyles["button-styles"]}
      >
        Accéder au prototype
      </NavLink>
    </FlexContainer>
  );
};

export default Home;
