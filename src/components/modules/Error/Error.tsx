import React, { FC } from "react";
import { useTranslation, Trans } from "react-i18next";
import globalStyles from "@themes/Global.module.scss";
import { Card, FlexContainer, ButtonsGroup } from "../../ui";
import styles from "./Error.module.scss";

const Error: FC = () => {
  const { t } = useTranslation("components\\error");

  return (
    <FlexContainer expand fullCentered>
      <Card className={`${styles.card} ${globalStyles["animation-opacity"]}`}>
        <h1>
          <Trans t={t} i18nKey="title" />
        </h1>
        <hr />
        <p>
          <Trans t={t} i18nKey="description" />
        </p>
        <ButtonsGroup>
          <a href={document.location.origin}>
            <Trans t={t} i18nKey="reload" />
          </a>
          <a href={`${document.location.origin}/support`}>
            <Trans t={t} i18nKey="support" />
          </a>
        </ButtonsGroup>
      </Card>
    </FlexContainer>
  );
};

export default Error;
