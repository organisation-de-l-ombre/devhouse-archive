import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { NavLink } from "react-router-dom";
import Card from "../../components/Card/Card";
import cardStyles from "../../components/Card/Card.module.scss";
import flexContainerStyles from "../../components/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../themes/Global.module.scss";
import styles from "./NotFound.module.scss";
import FlexContainer from "../../components/FlexContainer/FlexContainer";

const NotFound = (): React.ReactElement => {
  const { t } = useTranslation("translation");

  return (
    <FlexContainer
      className={`${flexContainerStyles.container} ${globalStyles["alignment-full-center"]}`}
    >
      <Card
        className={`${styles.width} ${cardStyles.container} ${globalStyles.column}`}
      >
        <h1>
          <Trans t={t} i18nKey="pages.notFound.title" />
        </h1>
        <hr />
        <p>
          <Trans t={t} i18nKey="pages.notFound.description" />
        </p>
        <div className={styles["buttons-container"]}>
          <NavLink to="/">
            <Trans t={t} i18nKey="pages.notFound.homePage" />
          </NavLink>
          <NavLink to="/support">
            <Trans t={t} i18nKey="pages.notFound.supportPage" />
          </NavLink>
        </div>
      </Card>
    </FlexContainer>
  );
};

export default NotFound;
