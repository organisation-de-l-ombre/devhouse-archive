import React from "react";
import { NavLink } from "react-router-dom";
import FlexContainer from "../../components/ui/FlexContainer/FlexContainer";
import flexContainerStyles from "../../components/ui/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../themes/Global.module.scss";
import styles from "./Home.module.scss";
import buttonStyles from "../../components/ui/Button/Button.module.scss";
import YouTubePlayer from "../../components/ui/YouTubePlayer/YouTubePlayer";
import Button from "../../components/ui/Button/Button";
import BackToTop from "../../components/modules/BackToTop/BackToTop";
import ButtonsGroup from "../../components/ui/ButtonsGroup/ButtonsGroup";

const Home = (): React.ReactElement => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <>
      <YouTubePlayer
        title="Raiponce - Faire marche arrière"
        videoID="FPyU2A8HW2E"
        autoPlay
        open={open}
        setOpen={setOpen}
        autoClose
      />
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
          <Button onClick={() => setOpen(!open)}>Ouvrir la fenêtre</Button>
        </ButtonsGroup>
      </FlexContainer>
    </>
  );
};

export default Home;
