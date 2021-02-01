import { Dispatch } from "redux";
import {
  NotificationsObject,
  USER_FIRST_USE,
  UPDATE_NOTIFICATIONS_PERMISSIONS,
} from "./Types";
import { Action } from "../Types";

const setFirstUse = (): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: USER_FIRST_USE });
  };
};
const updateNotificationsPermissions = (
  payload: NotificationsObject
): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: UPDATE_NOTIFICATIONS_PERMISSIONS, payload });
  };
};

export { setFirstUse, updateNotificationsPermissions };
