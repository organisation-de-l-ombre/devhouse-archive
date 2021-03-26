import { Dispatch, SetStateAction } from "react";
import { Notification } from "../../store/notifications/Types";

interface NotificationsPreferencesHook {
  setNotificationsPreferencesState: Dispatch<SetStateAction<string | boolean>>;
  validateChoice: (
    setNotificationsWindowOpen: Dispatch<SetStateAction<boolean>>
  ) => boolean;
}
interface NotificationsManagerHook {
  addNotifications: (notifications: Notification[]) => void;
  deleteNotification: (id: string) => void;
  deleteAllNotifications: () => void;
}

export { NotificationsPreferencesHook, NotificationsManagerHook };
