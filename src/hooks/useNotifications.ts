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

interface NotificationsPreferencesHook {
  updatePreference: () => void;
  validateChoice: (
    choice: boolean,
    setNotificationsWindowOpen: Dispatch<SetStateAction<boolean>>
  ) => boolean;
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
  const { t } = useTranslation(
    "components\\ui\\notifications\\notificationsModal"
  );

  const updatePreference = useCallback((): void => {
    dispatch(updateNotificationsPermissions());
  }, [dispatch]);

  const validateChoice = useCallback(
    (
      choice,
      setNotificationsWindowOpen: Dispatch<SetStateAction<boolean>>
    ): boolean => {
      if (choice === allowNotifications && !firstUse) {
        alert(t("invalidPreference"));
        return false;
      }

      if (firstUse) {
        dispatch(setFirstUse());
      }

      updatePreference();
      setNotificationsWindowOpen(false);

      return true;
    },
    [allowNotifications, dispatch, firstUse, t, updatePreference]
  );

  return {
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
