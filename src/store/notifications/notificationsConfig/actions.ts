import { ApplicationAction } from "@store/types";

const USER_FIRST_USE = "notifications/setFirstUse";
const UPDATE_NOTIFICATIONS_PERMISSIONS = "notifications/permissionsUpdated";

const setFirstUse: ApplicationAction<"notifications/setFirstUse"> = () => {
  return { type: USER_FIRST_USE, payload: null };
};
const updateNotificationsPermissions: ApplicationAction<"notifications/permissionsUpdated"> =
  () => {
    return { type: UPDATE_NOTIFICATIONS_PERMISSIONS, payload: null };
  };

export {
  setFirstUse,
  updateNotificationsPermissions,
  UPDATE_NOTIFICATIONS_PERMISSIONS,
  USER_FIRST_USE,
};
export interface NotificationsConfigActionTypes {
  [USER_FIRST_USE]: null;
  [UPDATE_NOTIFICATIONS_PERMISSIONS]: null;
}
