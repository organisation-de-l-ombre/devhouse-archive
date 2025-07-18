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
import { GlobalState } from "./types";
import NotificationsDataReducer from "./notifications/notificationsData/reducer";
import LanguageReducer from "./language/reducer";
import ThemeReducer from "./theme/reducer";
import AccountReducer from "./account/reducer";
import NotificationsConfigReducer from "./notifications/notificationsConfig/reducer";
import PropertiesReducer from "./properties/reducer";
import MovieTitleReducer from "./movieTitle/reducer";

const createStore = (
  persistedState?: DeepPartial<GlobalState>,
  middlewares: Middleware[] = []
): Store<GlobalState> => {
  const reducer = combineReducers<GlobalState>({
    account: AccountReducer,
    language: LanguageReducer,
    properties: PropertiesReducer,
    movieTitle: MovieTitleReducer,
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
  "properties",
  "movieTitle",
  "notificationsData",
];

export { createStore, persistedKeys, persistBlacklist };
