/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { FcCheckmark } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../Modal/Modal";
import modalStyles from "../../Modal/Modal.module.scss";
import globalStyles from "../../../../themes/Global.module.scss";
import SelectList, { manageSelection } from "../../SelectList/SelectList";
import Button from "../../Button/Button";
import styles from "./NotificationModal.module.scss";
import generateNotificationID from "../../../../utilities/generateNotificationID";
import i18n from "../../../../languages/i18n";
import { NotificationsConfigState } from "../../../../store/notifications/Types";
import { GlobalState } from "../../../../store/Types";
import {
  pushNotifications,
  setFirstUse,
  updateNotificationsPermissions,
} from "../../../../store/notifications/Actions";

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
  const config: NotificationsConfigState = useSelector(
    (state: GlobalState): NotificationsConfigState => state.notificationsConfig
  );
  const dispatch = useDispatch();
  const [
    notificationsPreferencesState,
    setNotificationsPreferencesState,
  ] = React.useState<string | boolean>("default");
  const validateChoice = (): boolean => {
    if (
      notificationsPreferencesState === "default" ||
      notificationsPreferencesState === config.allowNotifications
    ) {
      alert(
        i18n.t(
          "components\\notifications\\notificationsModal:invalidPreference"
        )
      );

      return false;
    }

    setNotificationsPreferencesState("default");
    setOpen(false);

    return true;
  };

  React.useEffect((): (() => void) => {
    return (): void => {
      if (notificationsPreferencesState !== "default") {
        dispatch(
          updateNotificationsPermissions(
            notificationsPreferencesState as boolean
          )
        );
      }
    };
  }, [dispatch, notificationsPreferencesState]);

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
            {config.allowNotifications ? <FcCheckmark /> : <></>}
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
            {config.allowNotifications ? <></> : <FcCheckmark />}
          </li>
        </SelectList>
        <Button
          onClick={() => {
            if (config && config.firstUse) {
              dispatch(setFirstUse());
            }

            const validation: boolean = validateChoice();

            if (validation) {
              dispatch(
                pushNotifications([
                  {
                    id: generateNotificationID(),
                    type: "info",
                    time: 5000,
                    body: i18n.t(
                      "components\\notifications\\notificationsModal:preferencesUpdated"
                    ),
                  },
                ])
              );
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
