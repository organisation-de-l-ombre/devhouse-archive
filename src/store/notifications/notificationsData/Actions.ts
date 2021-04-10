import { Dispatch } from "redux";
import { Action, GetState } from "@store/Types";
import {
  Notification,
  NOTIFICATION_DELETE,
  NOTIFICATIONS_DELETE_ALL,
  NOTIFICATIONS_PUSH,
} from "./Types";

const pushNotifications = (notifications: Notification[]): Action => {
  return (dispatch: Dispatch, getState: GetState): void => {
    if (!getState().notificationsConfig.allowNotifications) {
      return;
    }

    dispatch({ type: NOTIFICATIONS_PUSH, payload: notifications });
  };
};
const removeNotification = (id: string): Action => {
  return (dispatch: Dispatch, getState: GetState): void => {
    if (!getState().notificationsConfig.allowNotifications) {
      return;
    }

    dispatch({ type: NOTIFICATION_DELETE, payload: id });
  };
};
const removeAllNotifications = (): Action => {
  return (dispatch: Dispatch, getState: GetState): void => {
    if (!getState().notificationsConfig.allowNotifications) {
      return;
    }

    dispatch({ type: NOTIFICATIONS_DELETE_ALL });
  };
};

export { pushNotifications, removeNotification, removeAllNotifications };
