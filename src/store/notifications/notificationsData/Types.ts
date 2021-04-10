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

const NOTIFICATIONS_PUSH = "NOTIFICATIONS_PUSH";
const NOTIFICATION_DELETE = "NOTIFICATION_DELETE";
const NOTIFICATIONS_DELETE_ALL = "NOTIFICATIONS_DELETE_ALL";

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
