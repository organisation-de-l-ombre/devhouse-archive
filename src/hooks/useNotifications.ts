import { useCallback, Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { GlobalState } from "@store/types";
import {
  setFirstUse,
  updateNotificationsPermissions,
} from "@store/notifications/notificationsConfig/actions";
import { NotificationsConfigState } from "@store/notifications/notificationsConfig/types";
import {
  pushNotifications,
  removeNotification,
  removeAllNotifications,
} from "@store/notifications/notificationsData/actions";
import {
  NotificationCreate,
  NotificationsDataState,
} from "@store/notifications/notificationsData/types";

interface NotificationsPreferencesHook {
  toggleFirstUse: () => void;
  updatePreference: () => void;
  validateChoice: (
    choice: boolean,
    setNotificationsWindowOpen: Dispatch<SetStateAction<boolean>>
  ) => void;
}

interface NotificationsManagerHook {
  addNotifications: (notifications: NotificationCreate[]) => void;
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
      if (firstUse) {
        toggleFirstUse();
      }

      if (choice === allowNotifications && !firstUse) {
        alert(t("invalidPreference"));
        return;
      }

      if (choice !== allowNotifications) {
        updatePreference();
      }

      addNotifications([
        {
          type: "info",
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
    (notifications: NotificationCreate[]): void => {
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
