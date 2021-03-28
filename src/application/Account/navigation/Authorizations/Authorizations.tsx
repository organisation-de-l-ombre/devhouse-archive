import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { AiOutlineLoading } from "react-icons/ai";
import { FaCheckCircle, FaRegTrashAlt } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import { Authorization } from "@developers-house/abdera";
import flexContainerStyles from "../../../../components/ui/FlexContainer/FlexContainer.module.scss";
import containerStyle from "../../Containers.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import FlexContainer from "../../../../components/ui/FlexContainer/FlexContainer";
import {
  useAuthorizations,
  useAuthorizationsDeleteMutation,
} from "../../../../hooks/API/Authorizations/Authorizations";
import Error from "../../../../components/modules/Error/Error";
import ButtonsGroup from "../../../../components/ui/ButtonsGroup/ButtonsGroup";
import Button from "../../../../components/ui/Button/Button";
import Card from "../../../../components/ui/Card/Card";
import cardStyles from "../../../../components/ui/Card/Card.module.scss";
import TextArea from "../../../../components/ui/TextArea/TextArea";
import useLanguage from "../../../../hooks/Language/Language";

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

const Authorizations = (): React.ReactElement => {
  const { isError, isLoading, isFetching, data, refetch } = useAuthorizations();
  const { t } = useTranslation("pages\\account\\sections\\authorizations");

  if (isError) {
    return <Error />;
  }

  return data ? (
    <FlexContainer
      className={`${flexContainerStyles.container} ${containerStyle.container} ${globalStyles["page-body-width"]}`}
    >
      <div className={containerStyle["buttons-root"]}>
        <h2>
          <Trans t={t} i18nKey="statusTitle" />
        </h2>
        <ButtonsGroup
          className={`${containerStyle["buttons-container"]} ${containerStyle["generic-margin-top"]}`}
        >
          <Button>
            {isLoading || isFetching ? (
              <>
                <AiOutlineLoading
                  className={globalStyles["rotate-infinite-animation"]}
                />
                <span>
                  <Trans t={t} i18nKey="buttons.status.fetching" />
                </span>
              </>
            ) : (
              <>
                <FaCheckCircle />
                <span>
                  <Trans t={t} i18nKey="buttons.status.fetched" />
                </span>
              </>
            )}
          </Button>
          <Button onClick={() => refetch()}>
            <MdRefresh />
            <span>
              <Trans t={t} i18nKey="buttons.refresh" />
            </span>
          </Button>
        </ButtonsGroup>
      </div>
      {data
        .filter((authorization: Authorization): boolean =>
          authorization.client.name.toLowerCase().includes("imr")
        )
        .map(
          (authorization: Authorization): React.ReactElement => (
            <AuthorizationCard
              key={authorization.client.id}
              authorization={authorization}
            />
          )
        )}
    </FlexContainer>
  ) : (
    <></>
  );
};

export default Authorizations;
