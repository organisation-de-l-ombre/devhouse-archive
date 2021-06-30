import {
  applyMiddleware,
  combineReducers,
  createStore as createReduxStore,
  DeepPartial,
  Middleware,
  Store,
} from "redux";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  createStateSyncMiddleware,
  initMessageListener,
  initStateWithPrevTab,
} from "redux-state-sync";
import { NotificationsDataReducer } from "./notifications/notificationsData/reducer";
import { LanguageReducer } from "./language/reducer";
import { ThemeReducer } from "./theme/reducer";
import { AccountReducer } from "./account/reducer";
import { GlobalState } from "./types";
import { NotificationsConfigReducer } from "./notifications/notificationsConfig/reducer";
import { InternalReducer } from "./internal/reducer";

const createStore = (
  persistedState?: DeepPartial<GlobalState>,
  middlewares: Middleware[] = []
): Store => {
  const reducer = combineReducers({
    account: AccountReducer,
    language: LanguageReducer,
    internal: InternalReducer,
    notificationsConfig: NotificationsConfigReducer,
    notificationsData: NotificationsDataReducer,
    theme: ThemeReducer,
  });

  if (typeof window !== "undefined") {
    middlewares.push(createStateSyncMiddleware());
  }

  let callCompose = applyMiddleware(reduxThunk, ...middlewares);

  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    callCompose = composeWithDevTools(callCompose);
  }

  const store = createReduxStore(reducer, persistedState as never, callCompose);

  if (typeof window !== "undefined") {
    initMessageListener(store);
    initStateWithPrevTab(store);
  }

  return store;
};

const persistedKeys: (keyof GlobalState)[] = [
  "account",
  "language",
  "notificationsConfig",
  "theme",
];
const persistBlacklist: (keyof GlobalState)[] = [
  "internal",
  "notificationsData",
];

export { createStore, persistedKeys, persistBlacklist };
