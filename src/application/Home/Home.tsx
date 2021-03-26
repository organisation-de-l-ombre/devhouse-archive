import React from "react";
import { NavLink } from "react-router-dom";
import FlexContainer from "../../components/ui/FlexContainer/FlexContainer";
import flexContainerStyles from "../../components/ui/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../themes/Global.module.scss";
import buttonStyles from "../../components/ui/Button/Button.module.scss";
import styles from "./Home.module.scss";
import YouTubePlayer from "../../components/ui/YouTubePlayer/YouTubePlayer";
import Button from "../../components/ui/Button/Button";
import BackToTop from "../../components/modules/BackToTop/BackToTop";

const Home = (): React.ReactElement => {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <>
      <YouTubePlayer
        title="Raiponce - I see the lights"
        videoID="ILRs2r6lcHY"
        autoPlay
        open={open}
        setOpen={setOpen}
        autoClose
      />
      <BackToTop />
      <FlexContainer
        className={`${flexContainerStyles.container} ${globalStyles["alignment-full-center"]} ${globalStyles["navbar-margin"]} ${styles.home}`}
      >
        <NavLink
          to="/movies/title/tangled"
          className={buttonStyles["button-styles"]}
        >
          Accéder au prototype
        </NavLink>
        <Button onClick={() => setOpen(!open)}>Ouvrir la fenêtre</Button>
      </FlexContainer>
    </>
  );
};

export default Home;
