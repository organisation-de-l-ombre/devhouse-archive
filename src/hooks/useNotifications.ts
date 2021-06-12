import { useCallback, Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
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
import generateNotificationID from "@lib/generateNotificationID";

interface NotificationsPreferencesHook {
  toggleFirstUse: () => void;
  updatePreference: () => void;
  validateChoice: (
    choice: boolean,
    setNotificationsWindowOpen: Dispatch<SetStateAction<boolean>>
  ) => void;
}

interface NotificationsManagerHook {
  addNotifications: (notifications: Notification[]) => void;
  deleteNotification: (id: string) => void;
  deleteAllNotifications: () => void;
}

const useNotificationsState = (): NotificationsConfigState &
  NotificationsDataState => {
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
  const { addNotifications } = useNotificationsManager();
  const { t } = useTranslation(
    "components\\ui\\notifications\\notificationsModal"
  );

  const toggleFirstUse = useCallback((): void => {
    dispatch(setFirstUse());
  }, [dispatch]);

  const updatePreference = useCallback((): void => {
    dispatch(updateNotificationsPermissions());
  }, [dispatch]);

  const validateChoice = useCallback(
    (
      choice,
      setNotificationsWindowOpen: Dispatch<SetStateAction<boolean>>
    ): void => {
      if (choice === allowNotifications && !firstUse) {
        alert(t("invalidPreference"));
        return;
      }

      if (firstUse) {
        toggleFirstUse();
      }

      updatePreference();
      addNotifications([
        {
          type: "info",
          id: generateNotificationID(),
          body: t("preferencesUpdated"),
          time: 5000,
        },
      ]);
      setNotificationsWindowOpen(false);
    },
    [
      addNotifications,
      allowNotifications,
      firstUse,
      t,
      toggleFirstUse,
      updatePreference,
    ]
  );

  return {
    toggleFirstUse,
    updatePreference,
    validateChoice,
  };
};

const useNotificationsManager = (): NotificationsManagerHook => {
  const dispatch = useDispatch();

  const addNotifications = useCallback(
    (notifications: Notification[]): void => {
      dispatch(pushNotifications(notifications));
    },
    [dispatch]
  );

  const deleteNotification = useCallback(
    (id: string): void => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  const deleteAllNotifications = useCallback((): void => {
    dispatch(removeAllNotifications());
  }, [dispatch]);

  return { addNotifications, deleteNotification, deleteAllNotifications };
};

export {
  useNotificationsState,
  useNotificationsPreferences,
  useNotificationsManager,
};
