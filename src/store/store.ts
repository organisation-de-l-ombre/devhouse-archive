import { applyMiddleware, combineReducers, createStore } from "redux";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  createStateSyncMiddleware,
  initMessageListener,
  initStateWithPrevTab,
} from "redux-state-sync";
import throttle from "lodash.throttle";
import {
  NotificationsDataReducer,
  notificationsDataState,
} from "./notifications/notificationsData/reducer";
import { languageState, LanguageReducer } from "./language/reducer";
import { themeState, ThemeReducer } from "./theme/reducer";
import { accountState, AccountReducer } from "./account/reducer";
import { GlobalState } from "./types";
import {
  NotificationsConfigReducer,
  notificationsConfigState,
} from "./notifications/notificationsConfig/reducer";
import { InternalReducer, internalState } from "./internal/reducer";

const middlewares = [reduxThunk, createStateSyncMiddleware()];
let callCompose = applyMiddleware(...middlewares);

if (process.env.NODE_ENV === "development") {
  callCompose = composeWithDevTools(callCompose);
}

const persistBlacklist: string[] = ["internal", "notificationsData"];
const globalState: GlobalState = {
  account: accountState,
  language: languageState,
  internal: internalState,
  notificationsConfig: notificationsConfigState,
  notificationsData: notificationsDataState,
  theme: themeState,
};

const save = localStorage.getItem("redux/save");

if (save) {
  Object.assign(globalState, JSON.parse(save as string));
}

const reducer = combineReducers({
  account: AccountReducer,
  language: LanguageReducer,
  internal: InternalReducer,
  notificationsConfig: NotificationsConfigReducer,
  notificationsData: NotificationsDataReducer,
  theme: ThemeReducer,
});
const store = createStore(reducer, globalState, callCompose);

store.subscribe(
  throttle((): void => {
    const state: GlobalState = store.getState();
    const toPersist: Record<string, unknown> = {};
    const keys: string[] = Object.keys(state).filter(
      (key: string): boolean => !persistBlacklist.includes(key)
    );

    for (const key of keys) {
      const item = key as keyof GlobalState;

      toPersist[item] = state[item];
    }

    localStorage.setItem("redux/save", JSON.stringify(toPersist));
  }, 500)
);

initMessageListener(store as never);
initStateWithPrevTab(store as never);

export default store;
