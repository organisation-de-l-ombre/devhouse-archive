/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { FcCheckmark } from "react-icons/fc";
import Modal from "../../Modal/Modal";
import modalStyles from "../../Modal/Modal.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import SelectList, { manageSelection } from "../../SelectList/SelectList";
import Button from "../../Button/Button";
import styles from "./NotificationsModal.module.scss";
import generateNotificationID from "../../../../lib/generateNotificationID";
import i18n from "../../../../languages/i18n";
import {
  useNotificationsManager,
  useNotificationsPreferences,
  useNotificationsState,
} from "../../../../hooks/Notifications/Notifications";

const NotificationsModal: React.FC<
  React.DetailedHTMLProps<
    React.AllHTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
> = ({ open, setOpen }) => {
  const { t } = useTranslation("components\\notifications\\notificationsModal");
  const { allowNotifications } = useNotificationsState();
  const {
    setNotificationsPreferencesState,
    validateChoice,
  } = useNotificationsPreferences();
  const { addNotifications } = useNotificationsManager();

  return (
    <Modal
      windowTitle={<Trans t={t} i18nKey="title" />}
      open={open}
      setOpen={setOpen}
    >
      <p
        className={`${globalStyles["primary-margin"]} ${globalStyles["text-align-center"]}`}
      >
        <Trans t={t} i18nKey="description" />
      </p>
      <div className={modalStyles["buttons-container"]}>
        <SelectList
          className={styles.items}
          defaultTitle={<Trans t={t} i18nKey="options.default" />}
          id="select-notifications-choice"
        >
          <li
            onClick={() => {
              setNotificationsPreferencesState(true);
              manageSelection("select-notifications-choice", "none");
            }}
          >
            <span>
              <Trans t={t} i18nKey="options.yes" />
            </span>
            {allowNotifications ? <FcCheckmark /> : <></>}
          </li>
          <li
            onClick={() => {
              setNotificationsPreferencesState(false);
              manageSelection("select-notifications-choice", "none");
            }}
          >
            <span>
              <Trans t={t} i18nKey="options.no" />
            </span>
            {allowNotifications ? <></> : <FcCheckmark />}
          </li>
        </SelectList>
        <Button
          onClick={() => {
            const validation: boolean = validateChoice(setOpen);

            if (validation) {
              addNotifications([
                {
                  id: generateNotificationID(),
                  type: "info",
                  time: 5000,
                  body: i18n.t(
                    "components\\notifications\\notificationsModal:preferencesUpdated"
                  ),
                },
              ]);
            }
          }}
        >
          <Trans t={t} i18nKey="savePreference" />
        </Button>
      </div>
    </Modal>
  );
};

export default NotificationsModal;
