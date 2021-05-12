import React from "react";
import { Trans, useTranslation } from "react-i18next";
import generateNotificationID from "@lib/generateNotificationID";
import { useNotificationsManager } from "@hooks/Notifications";
import { useUser } from "@hooks/User";
import {
  FlexContainer,
  TextArea,
  Button,
  GenericLoader,
  ButtonsGroup,
} from "@components/ui";
import globalStyles from "@themes/Global.module.scss";
import { FaEdit } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import containerStyle from "../../Containers.module.scss";

const Account = (): React.ReactElement => {
  const { t } = useTranslation("pages\\account\\sections\\account");
  const { user, removeUser } = useUser();
  const { addNotifications } = useNotificationsManager();
  const logout = React.useCallback((): void => {
    removeUser();
    addNotifications([
      {
        id: generateNotificationID(),
        type: "info",
        body: t("devHouse.loggedOut"),
        time: 5000,
      },
    ]);
  }, [addNotifications, removeUser, t]);

  if (!user) {
    return <></>;
  }

  return (
    <FlexContainer
      className={`${containerStyle.container} ${globalStyles["page-body-width"]}`}
    >
      <FlexContainer
        className={`${globalStyles["no-margin"]} ${containerStyle.card}`}
      >
        <h2>
          <Trans t={t} i18nKey="devHouse.title" />
        </h2>
        <FlexContainer className={containerStyle["forms-container"]}>
          <TextArea className={containerStyle["form-container"]}>
            <h3>
              <Trans t={t} i18nKey="devHouse.username" />
            </h3>
            <span>{user.username}</span>
          </TextArea>
          <TextArea className={containerStyle["form-container"]}>
            <h3>
              <Trans t={t} i18nKey="devHouse.id" />
            </h3>
            <span>{user.sub}</span>
          </TextArea>
          <TextArea className={containerStyle["form-container"]}>
            <h3>
              <Trans t={t} i18nKey="devHouse.dataCollection" />
            </h3>
            <span>
              {user.dataCollection ? (
                <Trans t={t} i18nKey="yes" />
              ) : (
                <Trans t={t} i18nKey="no" />
              )}
            </span>
          </TextArea>
          <TextArea className={containerStyle["form-container"]}>
            <h3>
              <Trans t={t} i18nKey="devHouse.premiumAccess" />
            </h3>
            <span>
              {user.premium ? (
                <Trans t={t} i18nKey="yes" />
              ) : (
                <Trans t={t} i18nKey="no" />
              )}
            </span>
          </TextArea>
        </FlexContainer>
        <ButtonsGroup
          allowExpand
          className={globalStyles["generic-margin-top"]}
        >
          <a href="https://developershouse.xyz/settings/" target="blank">
            <FaEdit />
            <span>
              <Trans t={t} i18nKey="devHouse.editAccount" />
            </span>
          </a>
          <Button onClick={logout}>
            <RiLogoutBoxRLine />
            <span>
              <Trans t={t} i18nKey="devHouse.logout" />
            </span>
          </Button>
        </ButtonsGroup>
      </FlexContainer>
      <FlexContainer className={containerStyle.card}>
        <h2>
          <Trans t={t} i18nKey="imr.title" />
        </h2>
        <GenericLoader className={containerStyle["generic-margin-top"]}>
          <Trans t={t} i18nKey="imr.notImplemented" />
        </GenericLoader>
      </FlexContainer>
    </FlexContainer>
  );
};

export default Account;
