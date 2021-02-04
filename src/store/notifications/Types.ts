interface NotificationsConfigObject {
  firstUse: boolean;
  allowNotifications: string | boolean;
}

type NotificationsConfigState = NotificationsConfigObject;
type NotificationsConfig = NotificationsConfigObject;

const USER_FIRST_USE = "USER_FIRST_USE";
const UPDATE_NOTIFICATIONS_PERMISSIONS = "UPDATE_NOTIFICATIONS_PERMISSIONS";

interface UserFirstUsePayload {
  type: typeof USER_FIRST_USE;
}
interface UpdateNotificationsPreferencePayload {
  type: typeof UPDATE_NOTIFICATIONS_PERMISSIONS;
  allowNotifications: boolean;
}

type NotificationsConfigPayload =
  | UserFirstUsePayload
  | UpdateNotificationsPreferencePayload;

interface NotificationObject {
  id: string;
  type: "info" | "warning" | "error";
  time: number;
  body: string;
}
interface NotificationsManagerObject {
  notifications: NotificationObject[];
}

type NotificationsManagerState = NotificationsManagerObject;
type NotificationsManager = NotificationsManagerObject;

const NOTIFICATIONS_PUSH = "NOTIFICATIONS_PUSH";
const NOTIFICATION_DELETE = "NOTIFICATION_DELETE";
const NOTIFICATIONS_DELETE_ALL = "NOTIFICATIONS_DELETE_ALL";

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

type NotificationsManagerPayload =
  | NotificationPushPayload
  | NotificationDeletePayload
  | NotificationDeleteAllPayload;

export {
  NotificationsConfigObject,
  NotificationsConfigState,
  NotificationsConfig,
  USER_FIRST_USE,
  UPDATE_NOTIFICATIONS_PERMISSIONS,
  NotificationsConfigPayload,
  NotificationObject,
  NotificationsManagerObject,
  NotificationsManagerState,
  NotificationsManager,
  NOTIFICATIONS_PUSH,
  NOTIFICATION_DELETE,
  NOTIFICATIONS_DELETE_ALL,
  NotificationsManagerPayload,
};
