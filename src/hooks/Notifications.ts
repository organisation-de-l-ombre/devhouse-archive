import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalState } from "../store/Types";
import i18n from "../languages/i18n";
import {
  clearNotifications,
  pushNotifications,
  removeNotification,
  setFirstUse,
  updateNotificationsPermissions,
} from "../store/notifications/Actions";
import {
  NotificationObject,
  NotificationsState,
} from "../store/notifications/Types";

const useNotificationsState = (): NotificationsState => {
  return useSelector(
    (state: GlobalState): NotificationsState => state.notifications
  );
};
const useNotificationsPreferences = (): {
  setNotificationsPreferencesState: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  notifications: NotificationsState;
  validateNotifications: (
    setNotificationsWindowOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  notificationsPereferencesState: string | boolean;
  registerChoice: () => void;
} => {
  const dispatch = useDispatch();
  const notifications = useNotificationsState();
  const notificationsPreferences = notifications.allowNotifications;
  const [
    notificationsPereferencesState,
    setNotificationsPreferencesState,
  ] = React.useState<string | boolean>("default");
  const validateNotifications = (
    setNotificationsWindowOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    if (
      notificationsPereferencesState === "default" ||
      (notificationsPereferencesState === notificationsPreferences &&
        !notifications.firstUse)
    ) {
      alert(
        i18n.t(
          "components\\notifications\\notificationsModal:invalidPreference"
        )
      );
      return;
    }

    dispatch(
      updateNotificationsPermissions(notificationsPereferencesState as boolean)
    );
    setNotificationsPreferencesState("default");
    setNotificationsWindowOpen(false);
  };
  const registerChoice = () => {
    dispatch(setFirstUse());
  };

  return {
    notificationsPereferencesState,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setNotificationsPreferencesState,
    validateNotifications,
    registerChoice,
  };
};
const useNotificationsManager = (): {
  addNotifications: (notifications: NotificationObject[]) => void;
  deleteNotification: (id: string) => void;
  deleteAllNotifications: () => void;
} => {
  const dispatch = useDispatch();
  const addNotifications = (notifications: NotificationObject[]): void => {
    dispatch(pushNotifications(notifications));
  };
  const deleteNotification = (id: string): void => {
    dispatch(removeNotification(id));
  };
  const deleteAllNotifications = (): void => {
    dispatch(clearNotifications());
  };

  return { addNotifications, deleteNotification, deleteAllNotifications };
};

export {
  useNotificationsState,
  useNotificationsPreferences,
  useNotificationsManager,
};
