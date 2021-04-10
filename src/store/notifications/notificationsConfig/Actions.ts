import { Action } from "@store/Types";
import { Dispatch } from "redux";
import { USER_FIRST_USE, UPDATE_NOTIFICATIONS_PERMISSIONS } from "./Types";

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
