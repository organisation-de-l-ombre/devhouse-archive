interface NotificationsConfigState {
  firstUse: boolean;
  allowNotifications: boolean;
}

const USER_FIRST_USE = "notifications/setFirstUse";
const UPDATE_NOTIFICATIONS_PERMISSIONS = "notifications/permissionsUpdated";

interface NotificationsConfigPayload {
  type: typeof USER_FIRST_USE | typeof UPDATE_NOTIFICATIONS_PERMISSIONS;
}

export {
  NotificationsConfigState,
  USER_FIRST_USE,
  UPDATE_NOTIFICATIONS_PERMISSIONS,
  NotificationsConfigPayload,
};
