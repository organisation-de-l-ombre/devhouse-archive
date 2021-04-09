import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { GlobalState } from "../../store/Types";
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
  ] = React.useState<string | boolean>(firstUse ? false : "default");
  const { t } = useTranslation("components\\notifications\\notificationsModal");

  const updatePreference = React.useCallback(
    (preference: boolean): void => {
      dispatch(updateNotificationsPermissions(preference as boolean));
    },
    [dispatch]
  );
  const validateChoice = React.useCallback(
    (
      setNotificationsWindowOpen: React.Dispatch<React.SetStateAction<boolean>>
    ): boolean => {
      if (
        notificationsPreferencesState === "default" ||
        (notificationsPreferencesState === allowNotifications && !firstUse)
      ) {
        alert(t("invalidPreference"));
        return false;
      }

      if (firstUse) {
        dispatch(setFirstUse());
      }

      updatePreference(notificationsPreferencesState as boolean);
      setNotificationsPreferencesState("default");
      setNotificationsWindowOpen(false);

      return true;
    },
    [
      allowNotifications,
      dispatch,
      firstUse,
      notificationsPreferencesState,
      t,
      updatePreference,
    ]
  );

  return {
    setNotificationsPreferencesState,
    updatePreference,
    validateChoice,
  };
};
const useNotificationsManager = (): NotificationsManagerHook => {
  const dispatch = useDispatch();

  const addNotifications = React.useCallback(
    (notifications: Notification[]): void => {
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
