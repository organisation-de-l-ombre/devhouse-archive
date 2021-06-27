import React, { ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import { AiOutlineLoading } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import { Authorization } from "@developers-house/abdera";
import { useAuthorizations } from "@hooks/API/useAuthorizations";
import {
  FlexContainer,
  Button,
  Card,
  ButtonsGroup,
  CardContainer,
} from "@components/ui";
import { ErrorComponent, withNetwork } from "@components/modules";
import { FunctionComponent } from "@typings/FunctionComponent";
import globalStyles from "@styles/Global.module.scss";
import AuthorizationCard from "./AuthorizationCard";
import containerStyle from "../../Containers.module.scss";

const Authorizations: FunctionComponent<HTMLDivElement> = () => {
  const { error, isFetching, data, refetch } = useAuthorizations();
  const { t } = useTranslation("pages\\account\\account");
  const { t: tRoot } = useTranslation("root");

  if (error) {
    return (
      <ErrorComponent
        errorMessage={tRoot("error.messages.generic", {
          statusCode: error.status,
        })}
      />
    );
  }

  if (!data) {
    return (
      <FlexContainer padding expand pageBodyWidth fullCentered>
        <Card
          noPadding
          transparent
          className={globalStyles["animation-opacity"]}
        >
          <h2>
            <Trans t={t} i18nKey="authorizations.noData.title" />
          </h2>
          <hr />
          <p>
            <Trans t={t} i18nKey="authorizations.noData.description" />
          </p>
        </Card>
      </FlexContainer>
    );
  }

  return (
    <FlexContainer
      padding
      expand
      column
      pageBodyWidth
      className={containerStyle.container}
    >
      <FlexContainer column>
        <h2 css={{ color: "var(--font-color-hover)" }}>
          <Trans t={t} i18nKey="authorizations.statusTitle" />
        </h2>
        <ButtonsGroup expand>
          <Button>
            {isFetching ? (
              <>
                <AiOutlineLoading
                  className={globalStyles["rotate-infinite-animation"]}
                />
                <span>
                  <Trans
                    t={t}
                    i18nKey="authorizations.buttons.status.fetching"
                  />
                </span>
              </>
            ) : (
              <>
                <FaCheckCircle />
                <span>
                  <Trans
                    t={t}
                    i18nKey="authorizations.buttons.status.fetched"
                  />
                </span>
              </>
            )}
          </Button>
          <Button onClick={() => refetch()}>
            <MdRefresh />
            <span>
              <Trans t={t} i18nKey="authorizations.buttons.refresh" />
            </span>
          </Button>
        </ButtonsGroup>
      </FlexContainer>
      <CardContainer direction="column">
        {data
          .filter((authorization: Authorization): boolean =>
            authorization.audiences.includes("imr")
          )
          .map(
            (authorization: Authorization): ReactElement => (
              <AuthorizationCard
                key={authorization.client.id}
                authorization={authorization}
              />
            )
          )}
      </CardContainer>
    </FlexContainer>
  );
};

export default withNetwork(Authorizations);
