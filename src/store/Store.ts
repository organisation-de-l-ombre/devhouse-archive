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
import LanguageReducer, { languageState } from "./language/Reducer";
import {
  notificationsConfigState,
  notificationsManagerState,
  notificationsConfigReducer as NotificationsConfigReducer,
  notificationsManagerReducer as NotificationsManagerReducer,
} from "./notifications/Reducer";
import ThemeReducer, { themeState } from "./theme/Reducer";
import UserReducer, { userState } from "./user/Reducer";
import { GlobalState } from "./Types";

const reducer = combineReducers({
  language: LanguageReducer,
  notificationsConfig: NotificationsConfigReducer,
  notificationsManager: NotificationsManagerReducer,
  theme: ThemeReducer,
  user: UserReducer,
});
const persistConfiguration = {
  key: "root",
  storage,
  blacklist: ["notificationsManager"],
};
const syncConfiguration = {
  blacklist: ["persist/PERSIST", "persist/REHYDRATE"],
};
const middlewares = [reduxThunk, createStateSyncMiddleware(syncConfiguration)];
let callCompose = applyMiddleware(...middlewares);

if (process.env.NODE_ENV !== "production") {
  callCompose = composeWithDevTools(callCompose);
}

const persistedReducer = persistReducer(persistConfiguration, reducer);
const globalState: GlobalState = {
  language: languageState,
  notificationsConfig: notificationsConfigState,
  notificationsManager: notificationsManagerState,
  theme: themeState,
  user: userState,
};
const store = createStore(persistedReducer, globalState, callCompose);
const persistor = persistStore(store as never);

initMessageListener(store as never);
initStateWithPrevTab(store as never);

export { store, persistor };
