import React, { Dispatch, SetStateAction, useCallback } from "react";
import { useTranslation, Trans } from "react-i18next";
import { FaBell } from "react-icons/fa";
import generateNotificationID from "@lib/generateNotificationID";
import {
  useNotificationsManager,
  useNotificationsPreferences,
} from "@hooks/useNotifications";
import { Modal, Button, ButtonsGroup } from "@components/ui";
import { FunctionComponent } from "@typings/FunctionComponent";

const buttonStyles = {
  backgroundColor: "var(--primary-background-color-hover)",
};

const NotificationsModal: FunctionComponent<
  HTMLDivElement,
  {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
  }
> = ({ open, setOpen }) => {
  const { t } = useTranslation(
    "components\\ui\\notifications\\notificationsModal"
  );
  const { validateChoice } = useNotificationsPreferences();
  const { addNotifications } = useNotificationsManager();
  const validate = useCallback(
    (choice: boolean): void => {
      const success = validateChoice(choice, setOpen);

      if (success) {
        addNotifications([
          {
            type: "info",
            id: generateNotificationID(),
            body: t("preferencesUpdated"),
            time: 5000,
          },
        ]);
      }
    },
    [addNotifications, setOpen, t, validateChoice]
  );

  return (
    <Modal
      windowsIcon={<FaBell />}
      windowTitle={<Trans t={t} i18nKey="title" />}
      open={open}
      setOpen={setOpen}
    >
      <p css={{ lineHeight: "1.5" }}>
        <Trans t={t} i18nKey="description" />
      </p>
      <ButtonsGroup expand css={{ alignSelf: "center" }}>
        <Button css={buttonStyles} onClick={() => validate(true)}>
          <Trans t={t} i18nKey="options.yes" />
        </Button>
        <Button css={buttonStyles} onClick={() => validate(false)}>
          <Trans t={t} i18nKey="options.no" />
        </Button>
      </ButtonsGroup>
    </Modal>
  );
};

export default NotificationsModal;
