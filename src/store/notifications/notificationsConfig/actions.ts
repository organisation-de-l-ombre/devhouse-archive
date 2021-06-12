import { Action } from "@store/types";
import { Dispatch } from "redux";
import { USER_FIRST_USE, UPDATE_NOTIFICATIONS_PERMISSIONS } from "./types";

const setFirstUse = (): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: USER_FIRST_USE });
  };
};
const updateNotificationsPermissions = (): Action => {
  return (dispatch: Dispatch): void => {
    dispatch({ type: UPDATE_NOTIFICATIONS_PERMISSIONS });
  };
};

export { setFirstUse, updateNotificationsPermissions };
