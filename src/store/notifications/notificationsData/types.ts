import { ReactElement } from "react";
import { IconType } from "react-icons";

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
interface NotificationsDataState {
  notifications: Notification[];
}

const NOTIFICATIONS_PUSH = "notifications/push";
const NOTIFICATION_DELETE = "notifications/delete";
const NOTIFICATIONS_DELETE_ALL = "notifications/deleteAll";

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

type NotificationsDataPayload =
  | NotificationPushPayload
  | NotificationDeletePayload
  | NotificationDeleteAllPayload;

export {
  Button,
  Notification,
  NotificationsDataState,
  NOTIFICATIONS_PUSH,
  NOTIFICATION_DELETE,
  NOTIFICATIONS_DELETE_ALL,
  NotificationsDataPayload,
};
