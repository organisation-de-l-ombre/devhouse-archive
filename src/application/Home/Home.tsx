import React from "react";
import { NavLink } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { MdWork } from "react-icons/md";
import { RiMessage2Fill } from "react-icons/ri";
import { FlexContainer, ButtonsGroup, buttonStyles } from "@components/ui";
import globalStyles from "@themes/Global.module.scss";
import { BackToTop } from "@components/modules";
import { useSpring, animated } from "react-spring";
import styles from "./Home.module.scss";

const Home = (): React.ReactElement => {
  const { t } = useTranslation("pages\\home\\home");
  const headerStyles = useSpring({
    from: { transform: "scale(0)", opacity: "0" },
    to: { transform: "scale(1)", opacity: "1" },
    config: { duration: 500 },
  });
  const backgroundImage =
    "https://s3.developershouse.xyz/international-media-referencing/amelia-data-public/website-data/pictures/pages/home/home-headers-background.jpg";

  return (
    <FlexContainer className={globalStyles.column}>
      <div className={styles.headers}>
        <div
          className={styles["headers-background"]}
          style={{ backgroundImage: `url("${backgroundImage}")` }}
        />
        <animated.div
          style={headerStyles}
          className={styles["headers-content"]}
        >
          <h1>
            <Trans t={t} i18nKey="headers.title" />
          </h1>
          <h2>
            <Trans t={t} i18nKey="headers.presentation.0" />
          </h2>
          <h2>
            <Trans t={t} i18nKey="headers.presentation.1" />
          </h2>
          <ButtonsGroup className={styles["headers-buttons"]}>
            <NavLink className={buttonStyles["button-styles"]} to="/about">
              <MdWork />
              <span>
                <Trans t={t} i18nKey="headers.buttons.about" />
              </span>
            </NavLink>
            <NavLink className={buttonStyles["button-styles"]} to="/contact">
              <RiMessage2Fill />
              <span>
                <Trans t={t} i18nKey="headers.buttons.contact" />
              </span>
            </NavLink>
            <NavLink className={buttonStyles["button-styles"]} to="/support">
              <BsFillQuestionCircleFill />
              <span>
                <Trans t={t} i18nKey="headers.buttons.support" />
              </span>
            </NavLink>
          </ButtonsGroup>
        </animated.div>
      </div>
      <BackToTop />
      <FlexContainer
        className={`${globalStyles.column} ${styles.body} ${globalStyles["page-body-width"]}`}
      >
        <div className={`${globalStyles.flex} ${globalStyles.column}`}>
          <h2 style={{ color: "var(--font-color-hover)" }}>
            <Trans t={t} i18nKey="prototypeAccess.title" />
          </h2>
          <ButtonsGroup className={styles["buttons-container"]}>
            <NavLink
              className={buttonStyles["button-styles"]}
              to="/movies/title/tangled_994f87ryf.a4"
            >
              <Trans t={t} i18nKey="prototypeAccess.tangled" />
            </NavLink>
            <NavLink
              className={buttonStyles["button-styles"]}
              to="/movies/title/spirit_untamed_yrsctho8x.l"
            >
              <Trans t={t} i18nKey="prototypeAccess.spirit" />
            </NavLink>
          </ButtonsGroup>
        </div>
      </FlexContainer>
    </FlexContainer>
  );
};

export default Home;
