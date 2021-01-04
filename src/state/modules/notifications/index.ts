import { v4 as uuidv4 } from "uuid";

const NotificationRemove = "NOTIFICATION_REMOVE";
export const NotificationPush = "NOTIFICATION_PUSH";
const NotificationReadAll = "NOTIFICATION_READ_ALL";
const NotificationSetDisabled = "NOTIFICATION_SET_DISABLED";

export type Notification = {
  level: "warning" | "error" | "information";
  text: string;
  icon?: string;
  buttons?: { click: () => boolean; text: string }[];
  time: number;
  id?: string;
};

export interface NotificationsState {
  notifications: Notification[];
  enable: boolean;
}

type TNotificationRemove = {
  type: typeof NotificationRemove;
  id: string;
};

type TNotificationPush = {
  type: typeof NotificationPush;
  notification: Notification;
};

type TNotificationReadAll = {
  type: typeof NotificationReadAll;
};

type TNotificationSetDisabled = {
  type: typeof NotificationSetDisabled;
  disabled: boolean;
};

export type NotificationPayloadType =
  | TNotificationRemove
  | TNotificationPush
  | TNotificationReadAll
  | TNotificationSetDisabled;

export const defaultState: NotificationsState = {
  notifications: [],
  enable: true,
};

export default function reducer(
  state: NotificationsState = defaultState,
  payload: NotificationPayloadType
): NotificationsState {
  switch (payload.type) {
    case NotificationRemove: {
      const index = state.notifications.findIndex(
        (notification) => notification.id === payload.id
      );
      state.notifications = state.notifications.filter((_, i) => i !== index);
      break;
    }
    case NotificationPush:
      if (state.enable) {
        state.notifications = [
          {
            ...payload.notification,
            id: uuidv4(),
          },
          ...state.notifications,
        ];
      }
      break;
    case NotificationReadAll:
      state.notifications = [];
      break;
    case NotificationSetDisabled:
      state.enable = !payload.disabled;
      break;
    default:
      return state;
  }
  return state;
}

export function removeNotification(id: string): TNotificationRemove {
  return {
    type: NotificationRemove,
    id,
  };
}

export function pushNotification(
  notification: Notification
): TNotificationPush {
  return {
    type: NotificationPush,
    notification,
  };
}
