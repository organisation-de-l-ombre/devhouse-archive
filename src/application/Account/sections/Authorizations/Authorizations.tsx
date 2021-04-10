import React from "react";
import { Trans, useTranslation } from "react-i18next";
import { AiOutlineLoading } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import { Authorization } from "@developers-house/abdera";
import { useAuthorizations } from "@hooks/API/Authorizations";
import { FlexContainer, ButtonsGroup, Button, Card } from "@components/ui";
import { Error } from "@components/modules";
import globalStyles from "@themes/Global.module.scss";
import AuthorizationCard from "./AuthorizationCard";
import styles from "./Authorizations.module.scss";
import containerStyle from "../../Containers.module.scss";

const Authorizations = (): React.ReactElement => {
  const { isError, isLoading, isFetching, data, refetch } = useAuthorizations();
  const { t } = useTranslation("pages\\account\\sections\\authorizations");

  if (isError) {
    return <Error />;
  }

  return data ? (
    <FlexContainer
      className={`${containerStyle.container} ${globalStyles["page-body-width"]}`}
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
    <FlexContainer
      className={`${globalStyles["alignment-full-center"]} ${styles["no-data"]}`}
    >
      <Card className={`${styles.card} ${globalStyles["animation-opacity"]}`}>
        <h2>
          <Trans t={t} i18nKey="noData.title" />
        </h2>
        <hr />
        <p>
          <Trans t={t} i18nKey="noData.description" />
        </p>
      </Card>
    </FlexContainer>
  );
};

export default Authorizations;
