import { applyMiddleware, combineReducers, createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "localforage";
import reduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  createStateSyncMiddleware,
  initMessageListener,
  initStateWithPrevTab,
} from "redux-state-sync";
import { languageState, LanguageReducer } from "./language/Reducer";
import {
  notificationsState,
  NotificationsReducer,
} from "./notifications/Reducer";
import { themeState, ThemeReducer } from "./theme/Reducer";
import { userState, UserReducer } from "./user/Reducer";
import { GlobalState } from "./Types";

const reducer = combineReducers({
  language: LanguageReducer,
  notifications: NotificationsReducer,
  theme: ThemeReducer,
  user: UserReducer,
});
const persistConfiguration = {
  key: "root",
  storage,
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

const persistedReducer = persistReducer(persistConfiguration, reducer);
const globalState: GlobalState = {
  language: languageState,
  notifications: notificationsState,
  theme: themeState,
  user: userState,
};
const store = createStore(persistedReducer, globalState, callCompose);
const persistor = persistStore(store as never);

initMessageListener(store as never);
initStateWithPrevTab(store as never);

export { store, persistor };
