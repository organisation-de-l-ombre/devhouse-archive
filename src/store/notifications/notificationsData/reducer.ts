import { randomString } from "@lib/utils";
import {
  NOTIFICATION_DELETE,
  NOTIFICATIONS_DELETE_ALL,
  NOTIFICATIONS_PUSH,
} from "@store/actions";
import {
  Notification,
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
      for (const notification of payload.payload) {
        notification.id = randomString(10);
      }

      return {
        ...state,
        notifications: [
          ...state.notifications,
          ...payload.payload,
        ] as Notification[],
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

export default NotificationsDataReducer;
