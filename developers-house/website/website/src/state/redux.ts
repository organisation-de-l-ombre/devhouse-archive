/*
 * New redux interface.
 */

import {applyMiddleware, combineReducers, createStore, Store} from 'redux';
import reduxThunk from 'redux-thunk';
import axios, { AxiosRequestConfig } from 'axios';
import { createStateSyncMiddleware, initStateWithPrevTab  } from 'redux-state-sync';
import { Persistor, persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'

import { env } from "process";
import localforage from 'localforage';
import modules from './modules';
import { DefaultRootState } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const persistConfig = {
    key: 'root',
    storage: localforage,
  }

const buildDefaults = (): { defaultState: Partial<DefaultRootState>, reducers: { [T: string]: (...args: any[]) => unknown } } => {
    const reducers: { [T: string]: (...args: any[]) => unknown } = { };
    const state: DefaultRootState = { } as DefaultRootState;

    for (const module of Object.keys(modules)) {
        const mod = module as keyof typeof modules;
        state[mod] = modules[mod].defaultState as any;
        reducers[mod] = modules[mod].default;
    }

    return {
        defaultState: state,
        reducers: reducers
    };
};

export function createState (): { store: Store, persistor: Persistor } {
    const { defaultState, reducers } = buildDefaults();

    let callCompose = applyMiddleware(...[reduxThunk, createStateSyncMiddleware({
        blacklist: [
            'persist/PERSIST', 'persist/REHYDRATE'
        ]
    })]);

    if (env.NODE_ENV !== 'production') {
        callCompose = composeWithDevTools(callCompose);
    }

    const store = createStore(persistReducer(persistConfig, combineReducers(reducers) as any), defaultState as DefaultRootState, callCompose);
    
    initStateWithPrevTab(store);

    axios.interceptors.request.use((request): AxiosRequestConfig => {
        request.headers['Authorization'] = store.getState().user.token;
        return request;
    });
    let persistor = persistStore(store);
    
    return {
        store,
        persistor
    };
}
