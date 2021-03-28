import React from "react";
import { useTranslation, Trans } from "react-i18next";
import Card from "../../ui/Card/Card";
import cardStyles from "../../ui/Card/Card.module.scss";
import flexContainerStyles from "../../ui/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../../themes/Global.module.scss";
import styles from "./Error.module.scss";
import buttonStyles from "../../ui/Button/Button.module.scss";
import FlexContainer from "../../ui/FlexContainer/FlexContainer";
import ButtonsGroup from "../../ui/ButtonsGroup/ButtonsGroup";

const Error = (): React.ReactElement => {
  const { t } = useTranslation("components\\error");

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
