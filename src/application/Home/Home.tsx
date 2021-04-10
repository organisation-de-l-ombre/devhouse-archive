import React from "react";
import { NavLink } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { MdWork } from "react-icons/md";
import { RiMessage2Fill } from "react-icons/ri";
import FlexContainer from "@components/ui/FlexContainer/FlexContainer";
import globalStyles from "@themes/Global.module.scss";
import { buttonStyles } from "@components/ui/Button";
import BackToTop from "@components/modules/BackToTop/BackToTop";
import ButtonsGroup from "@components/ui/ButtonsGroup/ButtonsGroup";
import styles from "./Home.module.scss";

const Home = (): React.ReactElement => {
  const { t } = useTranslation("pages\\home\\home");
  const backgroundImage =
    "https://s3.developershouse.xyz/international-media-referencing/amelia-data-public/website-data/pictures/pages/home/home-headers-background.jpg";

  return (
    <FlexContainer
      className={`${globalStyles.column} ${globalStyles["navbar-margin"]}`}
    >
      <div className={styles.headers}>
        <div
          className={styles["headers-background"]}
          style={{ backgroundImage: `url("${backgroundImage}")` }}
        />
        <div className={styles["headers-content"]}>
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
        </div>
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
