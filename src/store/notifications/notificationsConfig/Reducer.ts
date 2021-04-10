import {
  NotificationsConfigPayload,
  NotificationsConfigState,
  UPDATE_NOTIFICATIONS_PERMISSIONS,
  USER_FIRST_USE,
} from "./Types";

const notificationsConfigState: NotificationsConfigState = {
  firstUse: true,
  allowNotifications: false,
};

const NotificationsConfigReducer = (
  state: NotificationsConfigState = notificationsConfigState,
  payload: NotificationsConfigPayload
): NotificationsConfigState => {
  switch (payload.type) {
    case USER_FIRST_USE:
      return { ...state, firstUse: false };

    case UPDATE_NOTIFICATIONS_PERMISSIONS:
      return {
        ...state,
        allowNotifications: !state.allowNotifications,
      };

    default:
      return state;
  }
};

export { notificationsConfigState, NotificationsConfigReducer };
