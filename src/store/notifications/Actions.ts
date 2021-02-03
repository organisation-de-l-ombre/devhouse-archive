import { Dispatch } from "redux";
import {
  USER_FIRST_USE,
  UPDATE_NOTIFICATIONS_PERMISSIONS,
  NOTIFICATIONS_PUSH,
  NOTIFICATION_DELETE,
  NOTIFICATIONS_DELETE_ALL,
  NotificationObject,
} from "./Types";
import { Action } from "../Types";

const setFirstUse = (): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: USER_FIRST_USE });
  };
};
const updateNotificationsPermissions = (
  allowNotifications: boolean
): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: UPDATE_NOTIFICATIONS_PERMISSIONS, allowNotifications });
  };
};
const pushNotifications = (notifications: NotificationObject[]): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: NOTIFICATIONS_PUSH, notifications });
  };
};
const removeNotification = (id: string): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: NOTIFICATION_DELETE, id });
  };
};
const clearNotifications = (): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: NOTIFICATIONS_DELETE_ALL });
  };
};

export {
  setFirstUse,
  updateNotificationsPermissions,
  pushNotifications,
  removeNotification,
  clearNotifications,
};
