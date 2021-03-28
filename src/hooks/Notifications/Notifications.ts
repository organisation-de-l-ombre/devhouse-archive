import { DefaultRootState, useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  Notification,
  NotificationsState,
} from "../../state/modules/notifications/Types";
import {
  pushNotification,
  removeNotification,
} from "../../state/modules/notifications/Actions";
import { NotificationsManagerHook } from "./Types";

const useNotificationsState = (): NotificationsState => {
  return useSelector(
    (state: DefaultRootState): NotificationsState => state.notifications
  );
};

const useNotificationsManager = (): NotificationsManagerHook => {
  const dispatch = useDispatch();

  const addNotification = useCallback(
    (notification: Notification): void => {
      dispatch(pushNotification(notification));
    },
    [dispatch]
  );

  const deleteNotification = useCallback(
    (id: string): void => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  return { addNotification, deleteNotification };
};

export { useNotificationsState, useNotificationsManager };
