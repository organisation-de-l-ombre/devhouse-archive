/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { User } from "./user/Types";
import { Theme } from "./theme/Types";
import { Language } from "./language/Types";

interface GlobalState {
  language: { language: Language };
  theme: { theme: Theme };
  user: { user: User };
}

type Action = ThunkAction<any, any, any, any>;

interface Dispatch {
  dispatch: ThunkDispatch<any, any, any>;
}

export type { GlobalState, Action, Dispatch };
