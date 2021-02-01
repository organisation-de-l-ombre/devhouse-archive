import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalState } from "../store/Types";
import i18n from "../languages/i18n";
import {
  updateNotificationsPermissions,
  setFirstUse,
} from "../store/notifications/Actions";
import { NotificationsState } from "../store/notifications/Types";

const useNotifications = (): {
  setNotificationsPreferencesState: (
    value:
      | ((prevState: string | boolean) => string | boolean)
      | string
      | boolean
  ) => void;
  notifications: NotificationsState;
  validateNotifications: (
    setNotificationsWindowOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  notificationsPereferencesState: string | boolean;
  registerChoice: () => void;
} => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: GlobalState): NotificationsState => state.notifications
  );
  const notificationsPreferences = notifications
    ? notifications.allowNotifications
    : false;
  const [
    notificationsPereferencesState,
    setNotificationsPreferencesState,
  ] = React.useState<string | boolean>("default");
  const validateNotifications = (
    setNotificationsWindowOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (
      notificationsPereferencesState === "default" ||
      notificationsPereferencesState === notificationsPreferences
    ) {
      alert(
        i18n.t(
          "components\\notifications\\notificationsModal:invalidPreference"
        )
      );
      return;
    }

    dispatch(
      updateNotificationsPermissions(
        Object.assign(notifications, {
          allowNotifications: notificationsPereferencesState,
        })
      )
    );
    setNotificationsPreferencesState("default");
    setNotificationsWindowOpen(false);
  };
  const registerChoice = () => {
    dispatch(setFirstUse());
  };

  return {
    notifications,
    notificationsPereferencesState,
    setNotificationsPreferencesState,
    validateNotifications,
    registerChoice,
  };
};

export default useNotifications;
