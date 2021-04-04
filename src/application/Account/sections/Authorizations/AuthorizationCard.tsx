import React from "react";
import { Authorization } from "@developers-house/abdera";
import { Trans, useTranslation } from "react-i18next";
import { FaRegTrashAlt } from "react-icons/fa";
import useLanguage from "../../../../hooks/Language/Language";
import { useAuthorizationsDeleteMutation } from "../../../../hooks/API/Authorizations/Authorizations";
import Card from "../../../../components/ui/Card/Card";
import cardStyles from "../../../../components/ui/Card/Card.module.scss";
import containerStyle from "../../Containers.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import FlexContainer from "../../../../components/ui/FlexContainer/FlexContainer";
import flexContainerStyles from "../../../../components/ui/FlexContainer/FlexContainer.module.scss";
import TextArea from "../../../../components/ui/TextArea/TextArea";
import ButtonsGroup from "../../../../components/ui/ButtonsGroup/ButtonsGroup";
import Button from "../../../../components/ui/Button/Button";

const AuthorizationCard: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { authorization: Authorization }
> = ({ authorization }) => {
  const { t } = useTranslation("pages\\account\\sections\\authorizations");
  const { language } = useLanguage();
  const grantedAt: string[] = new Intl.DateTimeFormat(language, {
    dateStyle: "full",
    timeStyle: "long",
  } as Record<string, unknown>)
    .format(authorization.grantedAt)
    .split("");

  grantedAt[0] = grantedAt[0].toUpperCase();

  const { remove } = useAuthorizationsDeleteMutation(authorization.client.id);
  const deleteAuthorization = (): void => {
    const confirmation = window.confirm(t("deleteAuthorization.confirmation"));

    if (confirmation) {
      remove();
    }
  };

  return (
    <Card
      className={`${cardStyles.container} ${containerStyle.card} ${globalStyles.column}`}
    >
      <h2>{authorization.client.name}</h2>
      <FlexContainer
        className={`${flexContainerStyles.container} ${containerStyle["forms-container"]}`}
      >
        <TextArea className={containerStyle["form-container"]}>
          <h3>
            <Trans t={t} i18nKey="authorization.grantedAt" />
          </h3>
          <span>
            {authorization.grantedAt ? (
              grantedAt.join("")
            ) : (
              <Trans t={t} i18nKey="authorization.unknownDate" />
            )}
          </span>
        </TextArea>
        <TextArea className={containerStyle["form-container"]}>
          <h3>
            <Trans t={t} i18nKey="authorization.scopes" />
          </h3>
          <span>{authorization.scopes.join(", ")}</span>
        </TextArea>
        <TextArea className={containerStyle["form-container"]}>
          <h3>
            <Trans t={t} i18nKey="authorization.audiences" />
          </h3>
          <span>{authorization.audiences.join(", ")}</span>
        </TextArea>
      </FlexContainer>
      <ButtonsGroup className={containerStyle["buttons-container"]}>
        <Button onClick={deleteAuthorization}>
          <FaRegTrashAlt />
          <span>
            <Trans t={t} i18nKey="deleteAuthorization.button" />
          </span>
        </Button>
      </ButtonsGroup>
    </Card>
  );
};

export default AuthorizationCard;
