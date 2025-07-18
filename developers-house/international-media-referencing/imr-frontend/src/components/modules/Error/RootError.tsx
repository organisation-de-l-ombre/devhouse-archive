import React, { ComponentType } from "react";
import { useTranslation, Trans } from "react-i18next";
import globalStyles from "@styles/Global.module.scss";
import { FallbackProps } from "react-error-boundary";
import {
  Card,
  FlexContainer,
  ButtonsGroup,
  ButtonExternalLink,
} from "../../ui";

const RootError: ComponentType<FallbackProps> = () => {
  const { t } = useTranslation("error");

  return (
    <FlexContainer minHeight padding expand fullCentered>
      <Card
        maxWidth
        transparent
        className={globalStyles["opacity-display-animation"]}
      >
        <h1 css={{ fontSize: "30px" }}>
          <Trans t={t} i18nKey="error.title" />
        </h1>
        <hr />
        <p>
          <Trans t={t} i18nKey="error.description" />
        </p>
        <ButtonsGroup expand css={{ marginTop: "0.5rem" }}>
          <ButtonExternalLink href={document.location.origin}>
            <Trans t={t} i18nKey="error.buttons.homePage" />
          </ButtonExternalLink>
          <ButtonExternalLink href={`${document.location.origin}/support`}>
            <Trans t={t} i18nKey="error.buttons.supportPage" />
          </ButtonExternalLink>
        </ButtonsGroup>
      </Card>
    </FlexContainer>
  );
};

export default RootError;
