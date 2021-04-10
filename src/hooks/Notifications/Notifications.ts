import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  NotificationsManagerHook,
  NotificationsPreferencesHook,
} from "./Types";
import { GlobalState } from "@store/Types";
import {
  setFirstUse,
  updateNotificationsPermissions,
  NotificationsConfigState,
} from "@store/notifications/notificationsConfig";
import {
  pushNotifications,
  removeNotification,
  removeAllNotifications,
  Notification,
  NotificationsDataState,
} from "@store/notifications/notificationsData";

const useNotificationsState = (): NotificationsConfigState & NotificationsDataState => {
  const notificationsConfig = useSelector(
    (state: GlobalState): NotificationsConfigState => state.notificationsConfig
  );
  const notificationsData = useSelector(
    (state: GlobalState): NotificationsDataState => state.notificationsData
  );

  return { ...notificationsConfig, ...notificationsData };
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
    (): void => {
      dispatch(updateNotificationsPermissions());
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

      updatePreference();
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
    dispatch(removeAllNotifications());
  }, [dispatch]);

  return { addNotifications, deleteNotification, deleteAllNotifications };
};

export {
  useNotificationsState,
  useNotificationsPreferences,
  useNotificationsManager,
};
