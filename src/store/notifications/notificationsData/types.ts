import {
  NOTIFICATION_DELETE,
  NOTIFICATIONS_DELETE_ALL,
  NOTIFICATIONS_PUSH,
} from "@store/actions";

interface NotificationPayload {
  id?: string;
  type: "info" | "warning" | "error";
  body: string;
  time: number;
}

interface Notification {
  id: string;
  type: "info" | "warning" | "error";
  body: string;
  time: number;
}

interface NotificationsDataState {
  notifications: Notification[];
}

interface NotificationPushPayload {
  type: typeof NOTIFICATIONS_PUSH;
  payload: NotificationPayload[];
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
  Notification,
  NotificationPayload,
  NotificationsDataState,
  NotificationsDataPayload,
};
