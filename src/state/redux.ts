import { configureStore, DeepPartial } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import { Action, AnyAction } from "redux";
import pick from "lodash.pick";
import throttle from "lodash.throttle";
import {
  accountSlice,
  setClientId,
  setState,
  UserState,
} from "./slices/account/account";
import { themeSlice, ThemeState } from "./slices/theme/theme";
import {
  notificationsSlice,
  NotificationsState,
} from "./slices/notifications/notifications";
import { fetchClient } from "./slices/account/utils";

const save: ("account" | "theme")[] = ["account", "theme"];

const preloaded = {} as DeepPartial<{
  account: UserState;
  theme: ThemeState;
  notifications: NotificationsState;
}>;

save.forEach((key) => {
  const item = localStorage.getItem(`redux-save/${key}`);
  if (item) {
    try {
      preloaded[key] = JSON.parse(item);
    } catch (e) {
      preloaded[key] = undefined;
    }
  }
});

export const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    theme: themeSlice.reducer,
    notifications: notificationsSlice.reducer,
  },
  preloadedState: preloaded,
});
export type AppThunk<R, A extends Action = AnyAction> = ThunkAction<
  R,
  RootState,
  never,
  A
>;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Load the client id.
fetchClient()
  .then((id) => {
    store.dispatch(setClientId(id));
    store.dispatch(setState("available"));
  })
  .catch(() => {
    store.dispatch(setState("failed"));
  });

store.subscribe(
  throttle(() => {
    const state = store.getState();
    const obj = pick(state, save);
    Object.keys(obj).forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      localStorage.setItem(`redux-save/${key}`, JSON.stringify(obj[key]));
    });
  }, 500)
);
