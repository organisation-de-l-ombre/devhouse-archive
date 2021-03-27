import {
  NotificationRemove,
  NotificationPush,
  TNotificationPush,
  TNotificationRemove,
  Notification,
} from "./Types";

const removeNotification = (id: string): TNotificationRemove => {
  return {
    type: NotificationRemove,
    id,
  };
};

const pushNotification = (notification: Notification): TNotificationPush => {
  return {
    type: NotificationPush,
    notification,
  };
};

export { removeNotification, pushNotification };
