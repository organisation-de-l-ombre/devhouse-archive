const NotificationRemove = "NOTIFICATION_REMOVE";
const NotificationPush = "NOTIFICATION_PUSH";
const NotificationReadAll = "NOTIFICATION_READ_ALL";
const NotificationSetDisabled = "NOTIFICATION_SET_DISABLED";

type Notification = {
  level: "warning" | "error" | "information";
  text: string;
  icon?: string;
  buttons?: { click: () => boolean; text: string }[];
  time: number;
  id?: string;
};

interface NotificationsState {
  notifications: Notification[];
  enable: boolean;
}

type TNotificationRemove = {
  type: typeof NotificationRemove;
  id: string;
};

type TNotificationPush = {
  type: typeof NotificationPush;
  notification: Notification;
};

type TNotificationReadAll = {
  type: typeof NotificationReadAll;
};

type TNotificationSetDisabled = {
  type: typeof NotificationSetDisabled;
  disabled: boolean;
};

type NotificationPayloadType =
  | TNotificationRemove
  | TNotificationPush
  | TNotificationReadAll
  | TNotificationSetDisabled;

export {
  NotificationRemove,
  NotificationPush,
  NotificationReadAll,
  NotificationSetDisabled,
  Notification,
  NotificationsState,
  NotificationPayloadType,
  TNotificationRemove,
  TNotificationPush,
  TNotificationReadAll,
  TNotificationSetDisabled,
};
