import { applyMiddleware, combineReducers, createStore } from "redux";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  createStateSyncMiddleware,
  initMessageListener,
  initStateWithPrevTab,
} from "redux-state-sync";
import storage from "localforage";
import { persistReducer, persistStore } from "redux-persist";
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

const persistConfiguration = {
  key: "root",
  storage,
  blacklist: ["notificationsData"],
};
const syncConfiguration = {
  blacklist: [
    "persist/PERSIST",
    "persist/REHYDRATE",
    "USER_FIRST_USE",
    "UPDATE_NOTIFICATIONS_PERMISSIONS",
    "NOTIFICATIONS_PUSH",
    "NOTIFICATION_DELETE",
    "NOTIFICATIONS_DELETE_ALL",
  ],
};
const middlewares = [reduxThunk, createStateSyncMiddleware(syncConfiguration)];
let callCompose = applyMiddleware(...middlewares);

if (process.env.NODE_ENV !== "production") {
  callCompose = composeWithDevTools(callCompose);
}

const rootReducer = combineReducers({
  language: LanguageReducer,
  notificationsConfig: NotificationsConfigReducer,
  notificationsData: NotificationsDataReducer,
  theme: ThemeReducer,
  account: AccountReducer,
});
const globalState: GlobalState = {
  language: languageState,
  notificationsConfig: notificationsConfigState,
  notificationsData: notificationsDataState,
  theme: themeState,
  account: accountState,
};
const reducer = persistReducer(persistConfiguration, rootReducer);
const store = createStore(reducer, globalState, callCompose);
const persistedStore = persistStore(store);

initMessageListener(store as never);
initStateWithPrevTab(store as never);

export { store, persistedStore };
