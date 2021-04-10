import React from "react";
import { useTranslation, Trans } from "react-i18next";
import globalStyles from "@themes/Global.module.scss";
import { Card, FlexContainer, ButtonsGroup, buttonStyles } from "../../ui";
import styles from "./Error.module.scss";

const Error = (): React.ReactElement => {
  const { t } = useTranslation("components\\error");

  return (
    <FlexContainer className={globalStyles["alignment-full-center"]}>
      <Card className={`${styles.card} ${globalStyles["animation-opacity"]}`}>
        <h1>
          <Trans t={t} i18nKey="title" />
        </h1>
        <hr />
        <p>
          <Trans t={t} i18nKey="description" />
        </p>
        <ButtonsGroup className={styles["buttons-container"]}>
          <a
            className={buttonStyles["button-styles"]}
            href={document.location.origin}
          >
            <Trans t={t} i18nKey="reload" />
          </a>
          <a
            className={buttonStyles["button-styles"]}
            href={`${document.location.origin}/support`}
          >
            <Trans t={t} i18nKey="support" />
          </a>
        </ButtonsGroup>
      </Card>
    </FlexContainer>
  );
};

export default Error;
