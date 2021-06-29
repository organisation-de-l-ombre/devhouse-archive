import {
  Notification,
  NOTIFICATION_DELETE,
  NOTIFICATIONS_DELETE_ALL,
  NOTIFICATIONS_PUSH,
  NotificationsDataPayload,
  NotificationsDataState,
} from "./types";

const notificationsDataState: NotificationsDataState = {
  notifications: [],
};

const NotificationsDataReducer = (
  state: NotificationsDataState = notificationsDataState,
  payload: NotificationsDataPayload
): NotificationsDataState => {
  switch (payload.type) {
    case NOTIFICATIONS_PUSH:
      return {
        ...state,
        notifications: [...state.notifications, ...payload.payload],
      };

    case NOTIFICATION_DELETE:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification: Notification): boolean =>
            notification.id !== payload.payload
        ),
      };

    case NOTIFICATIONS_DELETE_ALL:
      return {
        ...state,
        notifications: [],
      };

    default:
      return state;
  }
};

export { notificationsDataState, NotificationsDataReducer };
