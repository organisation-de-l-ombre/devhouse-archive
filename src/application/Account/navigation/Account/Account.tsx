import React from "react";
import { Trans, useTranslation } from "react-i18next";
import FlexContainer from "../../../../components/ui/FlexContainer/FlexContainer";
import flexContainerStyles from "../../../../components/ui/FlexContainer/FlexContainer.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import containerStyle from "../../Containers.module.scss";
import Card from "../../../../components/ui/Card/Card";
import cardStyles from "../../../../components/ui/Card/Card.module.scss";
import TextArea from "../../../../components/ui/TextArea/TextArea";
import useUser from "../../../../hooks/User/User";
import ButtonsGroup from "../../../../components/ui/ButtonsGroup/ButtonsGroup";
import buttonStyles from "../../../../components/ui/Button/Button.module.scss";
import Button from "../../../../components/ui/Button/Button";
import { useNotificationsManager } from "../../../../hooks/Notifications/Notifications";
import generateNotificationID from "../../../../lib/generateNotificationID";
import GenericLoader from "../../../../components/ui/GenericLoader/GenericLoader";

const Account = (): React.ReactElement => {
  const { t } = useTranslation("pages\\account\\sections\\account");
  const { user, removeUser } = useUser();
  const { addNotifications } = useNotificationsManager();
  const logout = (): void => {
    removeUser();
    addNotifications([
      {
        id: generateNotificationID(),
        type: "info",
        body: t("devHouse.loggedOut"),
        time: 5000,
      },
    ]);
  };

  return user ? (
    <FlexContainer
      className={`${flexContainerStyles.container} ${containerStyle.container} ${globalStyles["page-body-width"]}`}
    >
      <Card
        className={`${cardStyles.container} ${globalStyles["no-margin"]} ${containerStyle.card} ${globalStyles.column}`}
      >
        <h2>
          <Trans t={t} i18nKey="devHouse.title" />
        </h2>
        <FlexContainer
          className={`${flexContainerStyles.container} ${containerStyle["forms-container"]}`}
        >
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
        <ButtonsGroup className={containerStyle["buttons-container"]}>
          <a
            className={buttonStyles["button-styles"]}
            href="https://developershouse.xyz/settings/"
            target="blank"
          >
            <Trans t={t} i18nKey="devHouse.editAccount" />
          </a>
          <Button onClick={logout}>
            <Trans t={t} i18nKey="devHouse.logout" />
          </Button>
        </ButtonsGroup>
      </Card>
      <Card
        className={`${cardStyles.container} ${containerStyle.card} ${globalStyles.column}`}
      >
        <h2>
          <Trans t={t} i18nKey="imr.title" />
        </h2>
        <GenericLoader className={containerStyle["generic-margin-top"]}>
          <Trans t={t} i18nKey="imr.notImplemented" />
        </GenericLoader>
      </Card>
    </FlexContainer>
  ) : (
    <></>
  );
};

export default Account;
