import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { NavLink } from "react-router-dom";
import Card from "../Card/Card";
import cardStyles from "../Card/Card.module.scss";
import flexContainerStyles from "../FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../themes/Global.module.scss";
import styles from "./NotFound.module.scss";
import FlexContainer from "../FlexContainer/FlexContainer";

const NotFound = (): React.ReactElement => {
  const { t } = useTranslation("components\\notFound");

  return (
    <FlexContainer
      className={`${flexContainerStyles.container} ${globalStyles["alignment-full-center"]}`}
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
        <div className={styles["buttons-container"]}>
          <NavLink to="/">
            <Trans t={t} i18nKey="homePage" />
          </NavLink>
          <NavLink to="/support">
            <Trans t={t} i18nKey="supportPage" />
          </NavLink>
        </div>
      </Card>
    </FlexContainer>
  );
};

export default NotFound;
