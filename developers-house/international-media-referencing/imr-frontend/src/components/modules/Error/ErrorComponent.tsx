import React, { useCallback } from "react";
import {
  FlexContainer,
  Card,
  ButtonsGroup,
  Button,
  ButtonLink,
} from "@components/ui";
import { useTranslation, Trans } from "react-i18next";
import { FunctionComponent } from "@typings/FunctionComponent";
import globalStyles from "@styles/Global.module.scss";

const ErrorComponent: FunctionComponent<
  HTMLDivElement,
  { minHeight?: boolean; errorMessage?: string }
> = ({ minHeight, errorMessage }) => {
  const { t } = useTranslation("root");
  const reload = useCallback(() => {
    document.location.reload();
  }, []);

  return (
    <FlexContainer minHeight={minHeight} padding expand fullCentered>
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
        {errorMessage && (
          <code css={{ marginTop: "1.5rem" }}>{errorMessage}</code>
        )}
        <ButtonsGroup expand css={{ marginTop: "0.5rem" }}>
          <Button onClick={reload}>
            <Trans t={t} i18nKey="error.buttons.reloadPage" />
          </Button>
          <ButtonLink to="/">
            <Trans t={t} i18nKey="error.buttons.homePage" />
          </ButtonLink>
          <ButtonLink to="/support">
            <Trans t={t} i18nKey="error.buttons.supportPage" />
          </ButtonLink>
        </ButtonsGroup>
      </Card>
    </FlexContainer>
  );
};

export default ErrorComponent;
