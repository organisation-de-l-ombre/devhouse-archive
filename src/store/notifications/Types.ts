import { ReactElement } from "react";
import { IconType } from "react-icons";
import { PersistState } from "redux-persist";

interface Button {
  text: string;
  icon?: ReactElement | IconType;
  onClick: () => unknown;
}
interface Notification {
  id: string;
  type: "info" | "warning" | "error";
  body: string;
  buttons?: Button[];
  time: number;
}
interface NotificationsReducerState {
  firstUse: boolean;
  allowNotifications: string | boolean;
  notifications: Notification[];
  _persist: PersistState;
}

const USER_FIRST_USE = "USER_FIRST_USE";
const UPDATE_NOTIFICATIONS_PERMISSIONS = "UPDATE_NOTIFICATIONS_PERMISSIONS";
const NOTIFICATIONS_PUSH = "NOTIFICATIONS_PUSH";
const NOTIFICATION_DELETE = "NOTIFICATION_DELETE";
const NOTIFICATIONS_DELETE_ALL = "NOTIFICATIONS_DELETE_ALL";

interface UserFirstUsePayload {
  type: typeof USER_FIRST_USE;
}
interface UpdateNotificationsPreferencePayload {
  type: typeof UPDATE_NOTIFICATIONS_PERMISSIONS;
  payload: boolean;
}
interface NotificationPushPayload {
  type: typeof NOTIFICATIONS_PUSH;
  payload: Notification[];
}
interface NotificationDeletePayload {
  type: typeof NOTIFICATION_DELETE;
  payload: string;
}
interface NotificationDeleteAllPayload {
  type: typeof NOTIFICATIONS_DELETE_ALL;
}

type NotificationsPayload =
  | UserFirstUsePayload
  | UpdateNotificationsPreferencePayload
  | NotificationPushPayload
  | NotificationDeletePayload
  | NotificationDeleteAllPayload;

export {
  Button,
  Notification,
  NotificationsReducerState,
  USER_FIRST_USE,
  UPDATE_NOTIFICATIONS_PERMISSIONS,
  NOTIFICATIONS_PUSH,
  NOTIFICATION_DELETE,
  NOTIFICATIONS_DELETE_ALL,
  NotificationsPayload,
};
