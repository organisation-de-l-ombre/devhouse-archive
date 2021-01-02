import { PersistState } from "redux-persist";
import * as notifications from "./notifications";
import * as theme from "./theme";
import * as user from "./user";

export const modules = {
  notifications,
  theme,
  user,
};

export default modules;

declare module "react-redux" {
  export interface DefaultRootState {
    user: user.UserState;
    notifications: notifications.NotificationsState;
    theme: theme.ThemeState;
    _persist: PersistState;
  }
}
