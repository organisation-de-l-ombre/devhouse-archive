import { Dispatch } from "redux";
import { ApplicationAction, GetState } from "@store/types";
import { NotificationCreate } from "./types";

const NOTIFICATIONS_PUSH = "notifications/push";
const NOTIFICATION_DELETE = "notifications/delete";
const NOTIFICATIONS_DELETE_ALL = "notifications/deleteAll";

const pushNotifications: ApplicationAction<
  "notifications/push",
  [NotificationCreate[]]
> = (notifications) => {
  return (dispatch: Dispatch, getState: GetState): void => {
    if (!getState().notificationsConfig.allowNotifications) {
      return;
    }

    dispatch({ type: NOTIFICATIONS_PUSH, payload: notifications });
  };
};

const removeNotification: ApplicationAction<"notifications/delete", [string]> =
  (id: string) => {
    return { type: NOTIFICATION_DELETE, payload: id };
  };

const removeAllNotifications: ApplicationAction<"notifications/deleteAll", []> =
  () => {
    return (dispatch: Dispatch, getState: GetState): void => {
      if (!getState().notificationsConfig.allowNotifications) {
        return;
      }

      dispatch({ type: NOTIFICATIONS_DELETE_ALL });
    };
  };

export {
  pushNotifications,
  removeNotification,
  removeAllNotifications,
  NOTIFICATIONS_PUSH,
  NOTIFICATION_DELETE,
  NOTIFICATIONS_DELETE_ALL,
};
export interface NotificationsDataActionTypes {
  [NOTIFICATIONS_PUSH]: NotificationCreate[];
  [NOTIFICATION_DELETE]: string;
  [NOTIFICATIONS_DELETE_ALL]: null;
}
