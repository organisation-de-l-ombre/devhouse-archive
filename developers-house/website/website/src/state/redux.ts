/*
 * New redux interface.
 */

import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import reduxThunk from "redux-thunk";
import axios, { AxiosRequestConfig } from "axios";
import {
  createStateSyncMiddleware,
  initStateWithPrevTab
} from "redux-state-sync";
import { Persistor, persistReducer, persistStore } from "redux-persist";

import { env } from "process";
import localforage from "localforage";
import modules from "./modules";
import { DefaultRootState } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { PersistConfig } from "redux-persist/es/types";

const persistConfig: PersistConfig<DefaultRootState> = {
  key: "root",
  storage: localforage,
  blacklist: ["notifications"]
};

const buildDefaults = (): {
  defaultState: Partial<DefaultRootState>;
  reducers: { [T: string]: (...arguments_: any[]) => unknown };
} => {
  const reducers: { [T: string]: (...arguments_: any[]) => unknown } = {};
  const state: DefaultRootState = {} as DefaultRootState;

  for (const module of Object.keys(modules)) {
    const module_ = module as keyof typeof modules;
    state[module_] = modules[module_].defaultState as any;
    reducers[module_] = modules[module_].default;
  }

  return {
    defaultState: state,
    reducers: reducers
  };
};

/**
 *
 */
export function createState(): { store: Store; persistor: Persistor } {
  const { defaultState, reducers } = buildDefaults();

  let callCompose = applyMiddleware(
    ...[
      reduxThunk,
      createStateSyncMiddleware({
        blacklist: ["persist/PERSIST", "persist/REHYDRATE", "notifications"]
      })
    ]
  );

  if (env.NODE_ENV !== "production") {
    callCompose = composeWithDevTools(callCompose);
  }

  const store = createStore(
    persistReducer(persistConfig, combineReducers(reducers) as any),
    defaultState as DefaultRootState,
    callCompose
  );

  initStateWithPrevTab(store);

  axios.interceptors.request.use(
    (request): AxiosRequestConfig => {
      request.headers["Authorization"] = `Bearer ${
        store.getState().user.token
      }`;
      return request;
    }
  );

  const persistor = persistStore(store);

  return {
    store,
    persistor
  };
}
