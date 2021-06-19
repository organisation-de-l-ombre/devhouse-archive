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
  const { t } = useTranslation("components\\modules\\error\\error");

  return (
    <FlexContainer minHeight padding expand fullCentered>
      <Card
        maxWidth
        transparent
        className={globalStyles["opacity-display-animation"]}
      >
        <h1>
          <Trans t={t} i18nKey="title" />
        </h1>
        <hr />
        <p>
          <Trans t={t} i18nKey="description" />
        </p>
        <ButtonsGroup expand css={{ marginTop: "0.5rem" }}>
          <ButtonExternalLink href={document.location.origin}>
            <Trans t={t} i18nKey="reloadWebsite" />
          </ButtonExternalLink>
          <ButtonExternalLink href={`${document.location.origin}/support`}>
            <Trans t={t} i18nKey="support" />
          </ButtonExternalLink>
        </ButtonsGroup>
      </Card>
    </FlexContainer>
  );
};

export default RootError;
