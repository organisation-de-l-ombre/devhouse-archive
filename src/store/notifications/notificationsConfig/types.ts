import {
  USER_FIRST_USE,
  UPDATE_NOTIFICATIONS_PERMISSIONS,
} from "@store/actions";

interface NotificationsConfigState {
  firstUse: boolean;
  allowNotifications: boolean;
}

interface NotificationsConfigPayload {
  type: typeof USER_FIRST_USE | typeof UPDATE_NOTIFICATIONS_PERMISSIONS;
}

export { NotificationsConfigState, NotificationsConfigPayload };
