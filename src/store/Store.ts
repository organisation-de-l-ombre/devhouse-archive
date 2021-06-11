import { applyMiddleware, combineReducers, createStore } from "redux";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  createStateSyncMiddleware,
  initMessageListener,
  initStateWithPrevTab,
} from "redux-state-sync";
import localforage from "localforage";
import throttle from "lodash.throttle";
import {
  NotificationsDataReducer,
  notificationsDataState,
} from "./notifications/notificationsData";
import { languageState, LanguageReducer } from "./language/Reducer";
import { themeState, ThemeReducer } from "./theme/Reducer";
import { accountState, AccountReducer } from "./account/Reducer";
import { GlobalState } from "./Types";
import {
  NotificationsConfigReducer,
  notificationsConfigState,
} from "./notifications/notificationsConfig";

const middlewares = [reduxThunk, createStateSyncMiddleware()];
let callCompose = applyMiddleware(...middlewares);

if (process.env.NODE_ENV === "development") {
  callCompose = composeWithDevTools(callCompose);
}

const persistBlacklist: string[] = ["notificationsData"];
const globalState: GlobalState = {
  language: languageState,
  notificationsConfig: notificationsConfigState,
  notificationsData: notificationsDataState,
  theme: themeState,
  account: accountState,
};

localforage.getItem("redux/save").then((save): void => {
  if (!save) {
    return;
  }

  const persistedState: GlobalState = JSON.parse(save as string);
  const keys: string[] = Object.keys(persistedState).filter(
    (key: string): boolean => !persistBlacklist.includes(key)
  );

  for (const key of keys) {
    const item = key as keyof GlobalState;

    globalState[item] = persistedState[item] as never;
  }
});

const reducer = combineReducers({
  language: LanguageReducer,
  notificationsConfig: NotificationsConfigReducer,
  notificationsData: NotificationsDataReducer,
  theme: ThemeReducer,
  account: AccountReducer,
});
const store = createStore(reducer, globalState, callCompose);

store.subscribe(
  throttle(() => {
    const state: GlobalState = store.getState();

    localforage.setItem("redux/save", JSON.stringify(state));
  }, 500)
);

initMessageListener(store as never);
initStateWithPrevTab(store as never);

export default store;
