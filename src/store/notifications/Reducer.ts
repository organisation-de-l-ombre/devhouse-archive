import {
  NOTIFICATION_DELETE,
  NOTIFICATIONS_DELETE_ALL,
  NOTIFICATIONS_PUSH,
  NotificationsPayload,
  NotificationsState,
  UPDATE_NOTIFICATIONS_PERMISSIONS,
  USER_FIRST_USE,
  NotificationObject,
} from "./Types";

const notificationsState: NotificationsState = {
  firstUse: true,
  allowNotifications: false,
  notifications: [],
};
const notificationsReducer = (
  state: NotificationsState = notificationsState,
  payload: NotificationsPayload
): NotificationsState => {
  switch (payload.type) {
    case USER_FIRST_USE:
      return { ...state, firstUse: false };

    case UPDATE_NOTIFICATIONS_PERMISSIONS:
      return { ...state, allowNotifications: payload.allowNotifications };

    case NOTIFICATIONS_PUSH:
      return {
        ...state,
        notifications: [...state.notifications, ...payload.notifications],
      };

    case NOTIFICATION_DELETE:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification: NotificationObject): boolean =>
            notification.id !== payload.id
        ),
      };

    case NOTIFICATIONS_DELETE_ALL:
      return { ...state, notifications: [] };

    default:
      return state;
  }
};

export default notificationsReducer;
export { notificationsState };
