import React, { useCallback } from "react";
import { Authorization } from "@developers-house/abdera";
import { Trans, useTranslation } from "react-i18next";
import { FaRegTrashAlt } from "react-icons/fa";
import useLanguage from "@hooks/useLanguage";
import { useAuthorizationsDeleteMutation } from "@hooks/API/useAuthorizations";
import {
  FlexContainer,
  TextArea,
  Button,
  ButtonsGroup,
  Card,
} from "@components/ui";
import { FunctionComponent } from "@typings/FunctionComponent";
import containerStyle from "../../Containers.module.scss";

const AuthorizationCard: FunctionComponent<
  HTMLDivElement,
  { authorization: Authorization }
> = ({ authorization }) => {
  const { t } = useTranslation("pages\\account\\account");
  const { language } = useLanguage();
  const grantedAt: string[] = new Intl.DateTimeFormat(language, {
    dateStyle: "full",
    timeStyle: "long",
  } as Record<string, unknown>)
    .format(authorization.grantedAt)
    .split("");

  grantedAt[0] = grantedAt[0].toUpperCase();

  const { remove } = useAuthorizationsDeleteMutation(authorization.client.id);
  const deleteAuthorization = useCallback((): void => {
    const confirmation = window.confirm(
      t("authorizations.deleteAuthorization.confirmation")
    );

    if (confirmation) {
      remove();
    }
  }, [remove, t]);

  return (
    <Card noPadding transparent className={containerStyle.card}>
      <h2>{authorization.client.name}</h2>
      <FlexContainer allowWrap className={containerStyle["forms-container"]}>
        <TextArea>
          <h3>
            <Trans t={t} i18nKey="authorizations.authorization.grantedAt" />
          </h3>
          <span>
            {authorization.grantedAt ? (
              grantedAt.join("")
            ) : (
              <Trans t={t} i18nKey="authorizations.authorization.unknownDate" />
            )}
          </span>
        </TextArea>
        <TextArea>
          <h3>
            <Trans t={t} i18nKey="authorizations.authorization.scopes" />
          </h3>
          <span>{authorization.scopes.join(", ")}</span>
        </TextArea>
        <TextArea>
          <h3>
            <Trans t={t} i18nKey="authorizations.authorization.audiences" />
          </h3>
          <span>{authorization.audiences.join(", ")}</span>
        </TextArea>
      </FlexContainer>
      <ButtonsGroup genericMarginTop expand>
        <Button onClick={deleteAuthorization}>
          <FaRegTrashAlt />
          <span>
            <Trans t={t} i18nKey="authorizations.deleteAuthorization.button" />
          </span>
        </Button>
      </ButtonsGroup>
    </Card>
  );
};

export default AuthorizationCard;
