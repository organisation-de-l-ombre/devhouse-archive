import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { NavLink } from "react-router-dom";
import globalStyles from "@themes/Global.module.scss";
import { Card, FlexContainer, buttonStyles, ButtonsGroup } from "../../ui";
import styles from "./NotFound.module.scss";

const NotFound: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
> = ({ className }) => {
  const { t } = useTranslation("components\\notFound");

  return (
    <FlexContainer
      className={`${globalStyles["alignment-full-center"]} ${
        globalStyles["navbar-margin"]
      }${className ? ` ${className}` : ""}`}
    >
      <Card className={`${styles.card} ${globalStyles["animation-opacity"]}`}>
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
