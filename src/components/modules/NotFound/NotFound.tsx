import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { NavLink } from "react-router-dom";
import Card from "../../ui/Card/Card";
import cardStyles from "../../ui/Card/Card.module.scss";
import flexContainerStyles from "../../ui/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../../themes/Global.module.scss";
import styles from "./NotFound.module.scss";
import buttonStyles from "../../ui/Button/Button.module.scss";
import FlexContainer from "../../ui/FlexContainer/FlexContainer";
import ButtonsGroup from "../../ui/ButtonsGroup/ButtonsGroup";

const NotFound = (): React.ReactElement => {
  const { t } = useTranslation("components\\notFound");

  return (
    <FlexContainer
      className={`${flexContainerStyles.container} ${globalStyles["alignment-full-center"]} ${globalStyles["navbar-margin"]}`}
    >
      <Card
        className={`${styles.card} ${cardStyles.container} ${globalStyles["animation-opacity"]}`}
      >
        <h1>
          <Trans t={t} i18nKey="title" />
        </h1>
        <hr />
        <p>
          <Trans t={t} i18nKey="description" />
        </p>
        <ButtonsGroup className={styles["buttons-container"]}>
          <NavLink className={buttonStyles["button-styles"]} to="/">
            <Trans t={t} i18nKey="homePage" />
          </NavLink>
          <NavLink className={buttonStyles["button-styles"]} to="/support">
            <Trans t={t} i18nKey="supportPage" />
          </NavLink>
        </ButtonsGroup>
      </Card>
    </FlexContainer>
  );
};

export default NotFound;
