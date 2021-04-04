import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { AiOutlineLoading } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import { Authorization } from "@developers-house/abdera";
import flexContainerStyles from "../../../../components/ui/FlexContainer/FlexContainer.module.scss";
import containerStyle from "../../Containers.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import FlexContainer from "../../../../components/ui/FlexContainer/FlexContainer";
import { useAuthorizations } from "../../../../hooks/API/Authorizations/Authorizations";
import Error from "../../../../components/modules/Error/Error";
import ButtonsGroup from "../../../../components/ui/ButtonsGroup/ButtonsGroup";
import Button from "../../../../components/ui/Button/Button";
import AuthorizationCard from "./AuthorizationCard";

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
          authorization.audiences.includes("imr")
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
