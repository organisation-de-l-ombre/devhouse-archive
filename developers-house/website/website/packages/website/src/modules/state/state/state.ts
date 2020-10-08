import {applyMiddleware, combineReducers, createStore, Store} from 'redux';
import reduxThunk from 'redux-thunk';
import throttle from 'lodash.throttle';
import axios, {AxiosRequestConfig} from 'axios';
import notifications, {defaultState as notificationsDefaultState, NotificationsState} from './notifications';
import theme, {defaultState as themeDefaultState, ThemeState} from './theme';

import {env} from "process";
import user, {defaultState as userDefaultState, UserState} from "./user";

export interface RootState {
    theme: ThemeState;
    notifications: NotificationsState;
    user: UserState;
}

const persistedStores = ['theme', 'user'];

const loadDefaultState = (defaultState: RootState): RootState => {
    return Object.assign(
        defaultState,
        JSON.parse(localStorage.getItem('state') || '{}')
    );
};

export async function loadState (): Promise<Store> {
    let callCompose = applyMiddleware(reduxThunk);

    if (env.NODE_ENV !== 'production') {
        const {composeWithDevTools} = await import('redux-devtools-extension');
        callCompose = composeWithDevTools(callCompose);
    }

    const store = createStore(
        combineReducers({
            notifications,
            theme,
            user
        }),
        loadDefaultState({
            theme: themeDefaultState,
            notifications: notificationsDefaultState,
            user: userDefaultState
        }),
        callCompose
    );

    axios.interceptors.request.use((request): AxiosRequestConfig => {
        request.headers['Authorization'] = store.getState().user.token;
        return request;
    });

    store.subscribe(
        throttle(() => {
            const state: unknown = {};

            for (const i of persistedStores) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                state[i] = store.getState()[i];
            }

            try {
                localStorage.setItem('state', JSON.stringify(state));
            } catch (e) {
                // Ignore serialization errors.
            }
        }, 1000)
    );
    return store;
}
