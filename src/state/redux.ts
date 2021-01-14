/*
 * New redux interface.
 */

import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import reduxThunk from "redux-thunk";
import {
  createStateSyncMiddleware,
  initStateWithPrevTab,
} from "redux-state-sync";
import { Persistor, persistReducer, persistStore } from "redux-persist";

import { env } from "process";
import { DefaultRootState } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { PersistConfig } from "redux-persist/es/types";
import localForage from "localforage";
import { modules } from "./modules";
import { GlobalGraphQLClient } from "../constants";
import { Logger } from "../utilities/logger";

const logger = new Logger("Redux");
const persistConfig: PersistConfig<DefaultRootState> = {
  key: "root",
  storage: localForage,
  blacklist: ["notifications"],
};

const buildDefaults = (): {
  defaultState: Partial<DefaultRootState>;
  reducers: { [T: string]: (...args: unknown[]) => unknown };
} => {
  logger.info("Building defaults");
  // eslint-disable-next-line
  const reducers: { [T: string]: (...args: any[]) => unknown } = {};
  const state: DefaultRootState = {} as DefaultRootState;

  Object.keys(modules).forEach((module) => {
    const mod = module as keyof typeof modules;
    // eslint-disable-next-line
    state[mod] = modules[mod].defaultState as any;
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
        blacklist: ["persist/PERSIST", "persist/REHYDRATE", "notifications"],
      }),
    ]
  );

  if (env.NODE_ENV !== "production") {
    logger.info("Enabling redux devtools");
    callCompose = composeWithDevTools(callCompose);
  }

  const store = createStore(
    // eslint-disable-next-line
    persistReducer(persistConfig, combineReducers(reducers) as any),
    defaultState as DefaultRootState,
    callCompose
  );

  store.subscribe(() => {
    logger.info("Authorization updated");
    GlobalGraphQLClient.setHeader(
      "Authorization",
      `Bearer ${store.getState().user.token}`
    );
  });

  initStateWithPrevTab(store);

  const persistor = persistStore(store);

  return {
    store,
    persistor,
  };
}
