import { ThunkAction } from "redux-thunk";
import { User } from "@store/account";
import { Theme } from "@store/theme";
import { Language } from "@store/language";
import { NotificationsDataState } from "@store/notifications/notificationsData";
import { NotificationsConfigState } from "./notifications/notificationsConfig";
import { InternalState } from "./internal/types";

interface GlobalState {
  account: { user: User };
  language: { language: Language };
  internal: InternalState;
  notificationsConfig: NotificationsConfigState;
  notificationsData: NotificationsDataState;
  theme: { theme: Theme };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Action = ThunkAction<any, any, any, any>;
type GetState = () => GlobalState;

export type { GlobalState, Action, GetState };
