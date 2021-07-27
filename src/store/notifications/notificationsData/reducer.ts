import { randomString } from "@lib/utils";
import { ApplicationReducer } from "@store/types";
import {
  NOTIFICATIONS_DELETE_ALL,
  NOTIFICATIONS_PUSH,
  NOTIFICATION_DELETE,
} from "./actions";
import { Notification, NotificationsDataState } from "./types";

const defaultNotificationData: NotificationsDataState = {
  notifications: [],
};

const NotificationsDataReducer: ApplicationReducer<"notificationsData"> = (
  state = defaultNotificationData,
  payload
): NotificationsDataState => {
  switch (payload.type) {
    case NOTIFICATIONS_PUSH: {
      const notifications = payload.payload as Notification[];
      for (const notification of notifications) {
        notification.id = randomString(10);
      }

      return {
        ...state,
        notifications: [...state.notifications, ...notifications],
      };
    }
    case NOTIFICATION_DELETE:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== payload.payload
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
