import React from "react";
import { css } from "@emotion/react";
import { useTranslation, Trans } from "react-i18next";
import globalStyles from "@styles/Global.module.scss";
import { FunctionComponent } from "@typings/FunctionComponent";
import { Card, FlexContainer, ButtonsGroup, ButtonLink } from "../../ui";

const NotFound: FunctionComponent<HTMLDivElement> = () => {
  const { t } = useTranslation("components\\notFound");

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
        <ButtonsGroup
          css={css`
            margin-top: 0.5rem;
          `}
        >
          <ButtonLink to="/">
            <Trans t={t} i18nKey="homePage" />
          </ButtonLink>
          <ButtonLink to="/support">
            <Trans t={t} i18nKey="supportPage" />
          </ButtonLink>
        </ButtonsGroup>
      </Card>
    </FlexContainer>
  );
};

export default NotFound;
