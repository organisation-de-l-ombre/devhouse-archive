import { DefaultRootState, useDispatch, useSelector } from "react-redux";
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

  const addNotification = (notification: Notification): void => {
    dispatch(pushNotification(notification));
  };

  const deleteNotification = (id: string): void => {
    dispatch(removeNotification(id));
  };

  return { addNotification, deleteNotification };
};

export { useNotificationsState, useNotificationsManager };
