interface Notification {
  id: string;
  type: "info" | "warning" | "error";
  body: string;
  time: number;
}
type NotificationCreate = Omit<Notification, "id">;

interface NotificationsDataState {
  notifications: Notification[];
}
export { Notification, NotificationsDataState, NotificationCreate };
