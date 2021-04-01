import React from "react";
import { NavLink } from "react-router-dom";
import FlexContainer from "../../components/ui/FlexContainer/FlexContainer";
import flexContainerStyles from "../../components/ui/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../themes/Global.module.scss";
import styles from "./Home.module.scss";
import buttonStyles from "../../components/ui/Button/Button.module.scss";
import BackToTop from "../../components/modules/BackToTop/BackToTop";
import ButtonsGroup from "../../components/ui/ButtonsGroup/ButtonsGroup";

const Home = (): React.ReactElement => {
  return (
    <>
      <BackToTop />
      <FlexContainer
        className={`${flexContainerStyles.container} ${globalStyles["alignment-full-center"]} ${globalStyles["navbar-margin"]} ${styles.home}`}
      >
        <ButtonsGroup>
          <NavLink
            className={buttonStyles["button-styles"]}
            to="/movies/title/tangled"
          >
            Accéder au prototype
          </NavLink>
        </ButtonsGroup>
      </FlexContainer>
    </>
  );
};

export default Home;
