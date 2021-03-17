import React from "react";
import { NavLink } from "react-router-dom";
import FlexContainer from "../../components/ui/FlexContainer/FlexContainer";
import flexContainerStyles from "../../components/ui/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../themes/Global.module.scss";
import buttonStyles from "../../components/ui/Button/Button.module.scss";
import styles from "./Home.module.scss";

const Home = (): React.ReactElement => {
  return (
    <FlexContainer
      className={`${flexContainerStyles.container} ${globalStyles["alignment-full-center"]} ${globalStyles["navbar-margin"]} ${styles.home}`}
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
