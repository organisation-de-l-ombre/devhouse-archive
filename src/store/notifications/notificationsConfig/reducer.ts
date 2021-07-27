import { ApplicationReducer } from "@store/types";
import { UPDATE_NOTIFICATIONS_PERMISSIONS, USER_FIRST_USE } from "./actions";
import { NotificationsConfigState } from "./types";

const defaultNotificationsConfig: NotificationsConfigState = {
  firstUse: true,
  allowNotifications: false,
};

const NotificationsConfigReducer: ApplicationReducer<"notificationsConfig"> = (
  state = defaultNotificationsConfig,
  payload
) => {
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

export default NotificationsConfigReducer;
