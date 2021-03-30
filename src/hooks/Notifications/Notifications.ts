import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalState } from "../../store/Types";
import i18n from "../../languages/i18n";
import {
  clearNotifications,
  pushNotifications,
  removeNotification,
  setFirstUse,
  updateNotificationsPermissions,
} from "../../store/notifications/Actions";
import {
  Notification,
  NotificationsReducerState,
} from "../../store/notifications/Types";
import {
  NotificationsManagerHook,
  NotificationsPreferencesHook,
} from "./Types";

const useNotificationsState = (): NotificationsReducerState => {
  return useSelector(
    (state: GlobalState): NotificationsReducerState => state.notifications
  );
};
const useNotificationsPreferences = (): NotificationsPreferencesHook => {
  const dispatch = useDispatch();
  const { allowNotifications, firstUse } = useNotificationsState();
  const [
    notificationsPreferencesState,
    setNotificationsPreferencesState,
  ] = React.useState<string | boolean>("default");
  const updatePreference = (preference: boolean): void => {
    dispatch(updateNotificationsPermissions(preference as boolean));
  };
  const validateChoice = (
    setNotificationsWindowOpen: React.Dispatch<React.SetStateAction<boolean>>
  ): boolean => {
    if (
      notificationsPreferencesState === "default" ||
      (notificationsPreferencesState === allowNotifications && !firstUse)
    ) {
      alert(
        i18n.t(
          "components\\notifications\\notificationsModal:invalidPreference"
        )
      );
      return false;
    }

    if (firstUse) {
      dispatch(setFirstUse());
    }

    updatePreference(notificationsPreferencesState as boolean);
    setNotificationsPreferencesState("default");
    setNotificationsWindowOpen(false);

    return true;
  };

  return {
    setNotificationsPreferencesState,
    updatePreference,
    validateChoice,
  };
};
const useNotificationsManager = (): NotificationsManagerHook => {
  const dispatch = useDispatch();
  const addNotifications = (notifications: Notification[]): void => {
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
