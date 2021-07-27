import { ThunkAction } from "redux-thunk";
import { DefaultRootState } from "react-redux";
import { UserState } from "./account/types";
import { LanguageReducerState } from "./language/types";
import { NotificationsDataState } from "./notifications/notificationsData/types";
import { NotificationsConfigState } from "./notifications/notificationsConfig/types";
import { PropertiesState } from "./properties/types";
import { ThemeState } from "./theme/types";
import { MovieTitleState } from "./movieTitle/types";
import { ReduxActions } from "./actions";

declare module "react-redux" {
  export interface DefaultRootState {
    account: UserState;
    language: LanguageReducerState;
    properties: PropertiesState;
    movieTitle: MovieTitleState;
    notificationsConfig: NotificationsConfigState;
    notificationsData: NotificationsDataState;
    theme: ThemeState;
  }
}

type GlobalState = DefaultRootState;

type ApplicationPayloads = {
  [Property in keyof ReduxActions]: {
    type: Property;
    payload: ReduxActions[Property];
  };
};

type ApplicationAction<
  Name extends keyof ReduxActions,
  T extends unknown[] = []
> = (
  ...args: T
) =>
  | ThunkAction<
      void,
      GlobalState,
      Record<string, never>,
      ApplicationPayloads[Name]
    >
  | ApplicationPayloads[Name];
type ApplicationReducer<Name extends keyof GlobalState> = (
  state: GlobalState[Name] | undefined,
  payload: ApplicationPayloads[keyof ReduxActions]
) => GlobalState[Name];
type GetState = () => GlobalState;

export type { GlobalState, ApplicationAction, GetState, ApplicationReducer };
