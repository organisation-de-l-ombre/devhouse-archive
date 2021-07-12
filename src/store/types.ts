import { ThunkAction } from "redux-thunk";
import { User } from "./account/types";
import { Language } from "./language/types";
import { NotificationsDataState } from "./notifications/notificationsData/types";
import { NotificationsConfigState } from "./notifications/notificationsConfig/types";
import { InternalState } from "./internal/types";
import { ThemeState } from "./theme/types";
import { MovieTitleState } from "./movieTitle/types";

interface GlobalState {
  account: { user: User };
  language: { language: Language };
  internal: InternalState;
  movieTitle: MovieTitleState;
  notificationsConfig: NotificationsConfigState;
  notificationsData: NotificationsDataState;
  theme: ThemeState;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Action = ThunkAction<any, any, any, any>;
type GetState = () => GlobalState;

export type { GlobalState, Action, GetState };
