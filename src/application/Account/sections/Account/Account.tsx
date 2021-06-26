import React, { useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import generateNotificationID from "@lib/generateNotificationID";
import { useNotificationsManager } from "@hooks/useNotifications";
import useAccount from "@hooks/useAccount";
import {
  FlexContainer,
  TextArea,
  Button,
  ButtonExternalLink,
  GenericLoader,
  ButtonsGroup,
  CardContainer,
  Card,
} from "@components/ui";
import { FaEdit } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FunctionComponent } from "@typings/FunctionComponent";
import { withNetwork } from "@components/modules";
import containerStyle from "../../Containers.module.scss";

const Account: FunctionComponent<HTMLDivElement> = () => {
  const { t } = useTranslation("pages\\account\\account");
  const { t: tRoot } = useTranslation("root");
  const { user, removeUser } = useAccount();
  const { addNotifications } = useNotificationsManager();
  const logout = useCallback((): void => {
    removeUser();
    addNotifications([
      {
        id: generateNotificationID(),
        type: "info",
        body: t("account.devHouse.loggedOut"),
        time: 5000,
      },
    ]);
  }, [addNotifications, removeUser, t]);

  if (!user) {
    return null;
  }

  return (
    <FlexContainer
      padding
      expand
      column
      pageBodyWidth
      className={containerStyle.container}
    >
      <CardContainer noMargin direction="column">
        <Card noPadding transparent className={containerStyle.card}>
          <h2>
            <Trans t={t} i18nKey="account.devHouse.title" />
          </h2>
          <FlexContainer
            allowWrap
            className={containerStyle["forms-container"]}
          >
            <TextArea>
              <h3>
                <Trans t={t} i18nKey="account.devHouse.username" />
              </h3>
              <span>{user.username}</span>
            </TextArea>
            <TextArea>
              <h3>
                <Trans t={t} i18nKey="account.devHouse.id" />
              </h3>
              <span>{user.sub}</span>
            </TextArea>
            <TextArea>
              <h3>
                <Trans t={t} i18nKey="account.devHouse.dataCollection" />
              </h3>
              <span>
                {user.dataCollection ? (
                  <Trans t={tRoot} i18nKey="global.yes" />
                ) : (
                  <Trans t={tRoot} i18nKey="global.no" />
                )}
              </span>
            </TextArea>
            <TextArea>
              <h3>
                <Trans t={t} i18nKey="account.devHouse.premiumAccess" />
              </h3>
              <span>
                {user.premium ? (
                  <Trans t={tRoot} i18nKey="global.yes" />
                ) : (
                  <Trans t={tRoot} i18nKey="global.no" />
                )}
              </span>
            </TextArea>
          </FlexContainer>
          <ButtonsGroup genericMarginTop expand>
            <ButtonExternalLink
              href="https://developershouse.xyz/settings/"
              target="blank"
            >
              <FaEdit />
              <span>
                <Trans t={t} i18nKey="account.devHouse.editAccount" />
              </span>
            </ButtonExternalLink>
            <Button onClick={logout}>
              <RiLogoutBoxRLine />
              <span>
                <Trans t={t} i18nKey="account.devHouse.logout" />
              </span>
            </Button>
          </ButtonsGroup>
        </Card>
        <Card noPadding transparent className={containerStyle.card}>
          <h2>
            <Trans t={t} i18nKey="account.imr.title" />
          </h2>
          <GenericLoader genericMarginTop>
            <Trans t={t} i18nKey="account.imr.notImplemented" />
          </GenericLoader>
        </Card>
      </CardContainer>
    </FlexContainer>
  );
};

export default withNetwork(Account);
