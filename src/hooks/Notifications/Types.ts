import { Notification } from "../../state/modules/notifications/Types";

export interface NotificationsManagerHook {
  addNotification: (notification: Notification) => void;
  deleteNotification: (id: string) => void;
}
