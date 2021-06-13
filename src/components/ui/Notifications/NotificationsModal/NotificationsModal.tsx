import React, { Dispatch, SetStateAction } from "react";
import { useTranslation, Trans } from "react-i18next";
import { FaBell } from "react-icons/fa";
import { useNotificationsPreferences } from "@hooks/useNotifications";
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
        <Button
          css={buttonStyles}
          onClick={() => validateChoice(true, setOpen)}
        >
          <Trans t={t} i18nKey="options.yes" />
        </Button>
        <Button
          css={buttonStyles}
          onClick={() => validateChoice(false, setOpen)}
        >
          <Trans t={t} i18nKey="options.no" />
        </Button>
      </ButtonsGroup>
    </Modal>
  );
};

export default NotificationsModal;
