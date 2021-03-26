import { Dispatch } from "redux";
import {
  USER_FIRST_USE,
  UPDATE_NOTIFICATIONS_PERMISSIONS,
  NOTIFICATIONS_PUSH,
  NOTIFICATION_DELETE,
  NOTIFICATIONS_DELETE_ALL,
  Notification,
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
    dispatch({
      type: UPDATE_NOTIFICATIONS_PERMISSIONS,
      payload: allowNotifications,
    });
  };
};
const pushNotifications = (notifications: Notification[]): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: NOTIFICATIONS_PUSH, payload: notifications });
  };
};
const removeNotification = (id: string): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: NOTIFICATION_DELETE, payload: id });
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
