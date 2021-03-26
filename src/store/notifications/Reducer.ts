import {
  NotificationsPayload,
  NotificationsReducerState,
  UPDATE_NOTIFICATIONS_PERMISSIONS,
  USER_FIRST_USE,
  NOTIFICATIONS_PUSH,
  NOTIFICATION_DELETE,
  NOTIFICATIONS_DELETE_ALL,
  Notification,
} from "./Types";

const notificationsState: NotificationsReducerState = {
  firstUse: true,
  allowNotifications: false,
  notifications: [],
};
const NotificationsReducer = (
  state: NotificationsReducerState = notificationsState,
  payload: NotificationsPayload
): NotificationsReducerState => {
  switch (payload.type) {
    case USER_FIRST_USE:
      return { ...state, firstUse: false };

    case UPDATE_NOTIFICATIONS_PERMISSIONS:
      return { ...state, allowNotifications: payload.payload };

    case NOTIFICATIONS_PUSH: {
      if (state.allowNotifications) {
        return {
          ...state,
          notifications: [...state.notifications, ...payload.payload],
        };
      }

      return state;
    }

    case NOTIFICATION_DELETE:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification: Notification): boolean =>
            notification.id !== payload.payload
        ),
      };

    case NOTIFICATIONS_DELETE_ALL:
      return { ...state, notifications: [] };

    default:
      return state;
  }
};

export { notificationsState, NotificationsReducer };
