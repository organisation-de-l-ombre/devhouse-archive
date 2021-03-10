import {
  NOTIFICATION_DELETE,
  NotificationObject,
  NOTIFICATIONS_DELETE_ALL,
  NOTIFICATIONS_PUSH,
  NotificationsConfigPayload,
  NotificationsConfigState,
  NotificationsManagerPayload,
  NotificationsManagerState,
  UPDATE_NOTIFICATIONS_PERMISSIONS,
  USER_FIRST_USE,
} from "./Types";

const notificationsConfigState: NotificationsConfigState = {
  firstUse: true,
  allowNotifications: false,
};
const notificationsManagerState: NotificationsManagerState = {
  notifications: [],
};
const notificationsConfigReducer = (
  state: NotificationsConfigState = notificationsConfigState,
  payload: NotificationsConfigPayload
): NotificationsConfigState => {
  switch (payload.type) {
    case USER_FIRST_USE:
      return { ...state, firstUse: false };

    case UPDATE_NOTIFICATIONS_PERMISSIONS:
      return { ...state, allowNotifications: payload.allowNotifications };

    default:
      return state;
  }
};
const notificationsManagerReducer = (
  state: NotificationsManagerState = notificationsManagerState,
  payload: NotificationsManagerPayload
): NotificationsManagerState => {
  switch (payload.type) {
    case NOTIFICATIONS_PUSH: {
      state.notifications = state.notifications.concat(payload.notifications);

      return state;
    }

    case NOTIFICATION_DELETE: {
      state.notifications = state.notifications.filter(
        (notification: NotificationObject): boolean =>
          notification.id !== payload.id
      );

      return state;
    }

    case NOTIFICATIONS_DELETE_ALL:
      return { ...state, notifications: [] };

    default:
      return state;
  }
};

export {
  notificationsConfigState,
  notificationsManagerState,
  notificationsConfigReducer,
  notificationsManagerReducer,
};
