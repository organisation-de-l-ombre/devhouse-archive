import React, { ComponentType, useCallback } from "react";
import { css } from "@emotion/react";
import { useTranslation, Trans } from "react-i18next";
import globalStyles from "@styles/Global.module.scss";
import { FallbackProps } from "react-error-boundary";
import { FunctionComponent } from "@typings/FunctionComponent";
import {
  Card,
  FlexContainer,
  ButtonsGroup,
  Button,
  ButtonLink,
  ButtonExternalLink,
} from "../../ui";

const buttonStyles = css`
  margin-top: 0.5rem;
`;

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
        <ButtonsGroup expand css={buttonStyles}>
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

const ErrorComponent: FunctionComponent<
  HTMLDivElement,
  { minHeight?: boolean; errorMessage?: string }
> = ({ minHeight, errorMessage }) => {
  const { t } = useTranslation("components\\modules\\error\\error");
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
        <h1>
          <Trans t={t} i18nKey="title" />
        </h1>
        <hr />
        <p>
          <Trans t={t} i18nKey="description" />
        </p>
        {errorMessage && (
          <code css={{ marginTop: "1.5rem" }}>{errorMessage}</code>
        )}
        <ButtonsGroup expand css={buttonStyles}>
          <Button onClick={reload}>
            <Trans t={t} i18nKey="reloadPage" />
          </Button>
          <ButtonLink to="support">
            <Trans t={t} i18nKey="support" />
          </ButtonLink>
        </ButtonsGroup>
      </Card>
    </FlexContainer>
  );
};

export { RootError, ErrorComponent };
