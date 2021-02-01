interface NotificationsObject {
  firstUse: boolean;
  allowNotifications: string | boolean;
}

type Notifications = NotificationsObject | undefined;

interface NotificationsPayload {
  type: string;
  payload: NotificationsObject;
}
type NotificationsState = Notifications;

const USER_FIRST_USE = "USER_FIRST_USE";
const UPDATE_NOTIFICATIONS_PERMISSIONS = "UPDATE_NOTIFICATIONS_PERMISSIONS";

export {
  NotificationsObject,
  Notifications,
  NotificationsPayload,
  NotificationsState,
  USER_FIRST_USE,
  UPDATE_NOTIFICATIONS_PERMISSIONS,
};
