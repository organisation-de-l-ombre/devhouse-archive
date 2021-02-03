interface NotificationObject {
  id: string;
  type: "info" | "warning" | "error";
  time: number;
  body: string;
}
interface NotificationsObject {
  firstUse: boolean;
  allowNotifications: string | boolean;
  notifications: NotificationObject[];
}

type Notifications = NotificationsObject;

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
  allowNotifications: boolean;
}
interface NotificationPushPayload {
  type: typeof NOTIFICATIONS_PUSH;
  notifications: NotificationObject[];
}
interface NotificationDeletePayload {
  type: typeof NOTIFICATION_DELETE;
  id: string;
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
type NotificationsState = NotificationsObject;

export {
  NotificationObject,
  NotificationsObject,
  Notifications,
  NotificationsPayload,
  NotificationsState,
  USER_FIRST_USE,
  UPDATE_NOTIFICATIONS_PERMISSIONS,
  NOTIFICATIONS_PUSH,
  NOTIFICATION_DELETE,
  NOTIFICATIONS_DELETE_ALL,
};
