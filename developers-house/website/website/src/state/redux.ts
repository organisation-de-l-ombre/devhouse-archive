/*
 * New redux interface.
 */

import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import reduxThunk from "redux-thunk";
import axios, { AxiosRequestConfig } from "axios";
import {
  createStateSyncMiddleware,
  initStateWithPrevTab,
} from "redux-state-sync";
import { Persistor, persistReducer, persistStore } from "redux-persist";

import { env } from "process";
import localforage from "localforage";
import { DefaultRootState } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { PersistConfig } from "redux-persist/es/types";
import { modules } from "./modules";
import { GlobalGraphQLClient } from "../constants";

const persistConfig: PersistConfig<DefaultRootState> = {
  key: "root",
  storage: localforage,
  blacklist: ["notifications"],
};

const buildDefaults = (): {
  defaultState: Partial<DefaultRootState>;
  reducers: { [T: string]: (...args: unknown[]) => unknown };
} => {
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
    callCompose = composeWithDevTools(callCompose);
  }

  const store = createStore(
    // eslint-disable-next-line
    persistReducer(persistConfig, combineReducers(reducers) as any),
    defaultState as DefaultRootState,
    callCompose
  );

  store.subscribe(() => {
    GlobalGraphQLClient.setHeader(
      "Authorization",
      `Bearer ${store.getState().user.token}`
    );
  });

  initStateWithPrevTab(store);

  axios.interceptors.request.use(
    (request): AxiosRequestConfig => {
      request.headers.Authorization = `Bearer ${store.getState().user.token}`;
      return request;
    }
  );

  const persistor = persistStore(store);

  return {
    store,
    persistor,
  };
}
