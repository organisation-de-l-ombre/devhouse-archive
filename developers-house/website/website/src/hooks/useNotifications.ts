import { useDispatch } from "react-redux";
import { useCallback } from "react";
import {
  addNotification,
  Notification,
  removeNotification,
} from "../state/slices/notifications/notifications";
import { useAppSelector } from "../state/hooks";
import { RootState } from "../state";

const useNotificationsState = (): RootState["notifications"] => {
  return useAppSelector((state) => state.notifications);
};

const useNotificationsManager = () => {
  const dispatch = useDispatch();

  const hookAddNotification = useCallback(
    (notification: Omit<Notification, "id">): void => {
      dispatch(addNotification(notification));
    },
    [dispatch]
  );

  const deleteNotification = useCallback(
    (id: string): void => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  return { addNotification: hookAddNotification, deleteNotification };
};

export { useNotificationsState, useNotificationsManager };
