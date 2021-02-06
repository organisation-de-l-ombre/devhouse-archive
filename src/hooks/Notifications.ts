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
  NotificationsConfigState,
  NotificationsManagerState,
} from "../store/notifications/Types";

const useNotificationsState = (): {
  config: NotificationsConfigState;
  manager: NotificationsManagerState;
} => {
  const config = useSelector(
    (state: GlobalState): NotificationsConfigState => state.notificationsConfig
  );
  const manager = useSelector(
    (state: GlobalState): NotificationsManagerState =>
      state.notificationsManager
  );

  return { config, manager };
};
const useNotificationsPreferences = (): {
  setNotificationsPreferencesState: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  notifications: NotificationsManagerState;
  validateNotifications: (
    setNotificationsWindowOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  notificationsPereferencesState: string | boolean;
  registerChoice: () => void;
} => {
  const dispatch = useDispatch();
  const { config } = useNotificationsState();
  const notificationsPreferences = config.allowNotifications;
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
        !config.firstUse)
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
  const addNotifications = React.useCallback(
    (notifications: NotificationObject[]): void => {
      dispatch(pushNotifications(notifications));
    },
    [dispatch]
  );
  const deleteNotification = React.useCallback(
    (id: string): void => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );
  const deleteAllNotifications = React.useCallback((): void => {
    dispatch(clearNotifications());
  }, [dispatch]);

  return { addNotifications, deleteNotification, deleteAllNotifications };
};

export {
  useNotificationsState,
  useNotificationsPreferences,
  useNotificationsManager,
};
