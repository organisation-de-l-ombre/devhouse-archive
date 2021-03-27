import { v4 as uuidv4 } from "uuid";
import {
  NotificationPayloadType,
  NotificationPush,
  NotificationReadAll,
  NotificationRemove,
  NotificationSetDisabled,
  NotificationsState,
} from "./Types";

const defaultState: NotificationsState = {
  notifications: [],
  enable: true,
};

const Reducer = (
  state: NotificationsState = defaultState,
  payload: NotificationPayloadType
): NotificationsState => {
  switch (payload.type) {
    case NotificationRemove: {
      const index = state.notifications.findIndex(
        (notification) => notification.id === payload.id
      );

      return {
        ...state,
        notifications: state.notifications.filter((_, i) => i !== index),
      };
    }

    case NotificationPush: {
      if (state.enable) {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            {
              ...payload.notification,
              id: uuidv4(),
            },
          ],
        };
      }

      return state;
    }

    case NotificationReadAll:
      return { ...state, notifications: [] };

    case NotificationSetDisabled:
      return { ...state, enable: !state.enable };

    default:
      return state;
  }
};

export { defaultState, Reducer };
