import { ThunkAction } from "redux-thunk";
import { User } from "./user/Types";
import { Theme } from "./theme/Types";
import { Language } from "./language/Types";
import { NotificationsConfigState } from "./notifications/notificationsConfig";
import { NotificationsDataState } from "./notifications/notificationsData/Types";

interface GlobalState {
  language: { language: Language };
  notificationsConfig: NotificationsConfigState;
  notificationsData: NotificationsDataState;
  theme: { theme: Theme };
  user: { user: User };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Action = ThunkAction<any, any, any, any>;
type GetState = () => GlobalState;

export type { GlobalState, Action, GetState };
