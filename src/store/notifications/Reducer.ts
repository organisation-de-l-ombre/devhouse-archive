import {
  USER_FIRST_USE,
  UPDATE_NOTIFICATIONS_PERMISSIONS,
  NotificationsPayload,
  NotificationsState,
} from "./Types";

const notificationsState: NotificationsState = {
  firstUse: true,
  allowNotifications: false,
};
const notificationsReducer = (
  state: NotificationsState = notificationsState,
  { type, payload }: NotificationsPayload
): NotificationsState => {
  switch (type) {
    case USER_FIRST_USE:
      return { ...state, firstUse: false };

    case UPDATE_NOTIFICATIONS_PERMISSIONS:
      return { ...state, allowNotifications: payload.allowNotifications };

    default:
      return state;
  }
};

export default notificationsReducer;
export { notificationsState };
