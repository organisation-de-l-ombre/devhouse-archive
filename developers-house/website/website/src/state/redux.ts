import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import reduxThunk from "redux-thunk";
import {
  createStateSyncMiddleware,
  initStateWithPrevTab,
} from "redux-state-sync";
import { persistReducer, PersistState, persistStore } from "redux-persist";

import { env } from "process";
import { DefaultRootState } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { PersistConfig, Persistor } from "redux-persist/es/types";
import localForage from "localforage";
import { modules } from "./modules";
import { Logger } from "../utilities/logger";

const logger = new Logger("Redux");
const persistConfig: PersistConfig<DefaultRootState> = {
  key: "root",
  storage: localForage,
  blacklist: ["notifications"],
};
type ValueOf<T> = T[keyof T];
type ModulesKeys = keyof typeof modules;

type ReducerMap = {
  [K in ModulesKeys]: ValueOf<typeof modules>["default"];
};
type DefaultStateMap = {
  [K in ModulesKeys]: ValueOf<typeof modules>["defaultState"];
} & {
  _persist: PersistState;
};

const buildDefaults = (): {
  defaultState: DefaultStateMap;
  reducers: ReducerMap;
} => {
  logger.info("Building defaults");

  const reducers: ReducerMap = {} as ReducerMap;
  const state: DefaultStateMap = {} as DefaultStateMap;

  Object.keys(modules).forEach((module) => {
    const mod = module as ModulesKeys;
    state[mod] = modules[mod].defaultState;
    reducers[mod] = modules[mod].default;
  });

  return {
    defaultState: state,
    reducers,
  };
};

export function createState(): { store: Store; persistor: Persistor } {
  logger.info("Bootstrapping redux");
  const { defaultState, reducers } = buildDefaults();

  let callCompose = applyMiddleware(
    ...[
      reduxThunk,
      createStateSyncMiddleware({
        blacklist: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "notifications",
          "NOTIFICATION_REMOVE",
          "NOTIFICATION_PUSH",
          "NOTIFICATION_READ_ALL",
          "NOTIFICATION_SET_DISABLED",
        ],
      }),
    ]
  );

  if (env.NODE_ENV !== "production") {
    logger.info("Enabling redux devtools");
    callCompose = composeWithDevTools(callCompose);
  }

  const store = createStore(
    persistReducer(persistConfig, combineReducers(reducers) as never),
    defaultState as DefaultRootState,
    callCompose
  );

  initStateWithPrevTab(store);

  const persistor = persistStore(store);

  return {
    store,
    persistor,
  };
}
